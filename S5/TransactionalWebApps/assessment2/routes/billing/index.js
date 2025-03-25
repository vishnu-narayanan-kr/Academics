"use strict";
const async = require("async");
const express = require("express");
const logger = require("./../../logger")(module);
const format = require("date-fns/format");
const router = express.Router();
const { validationError, genericError } = require("./../../utils/error");
const getAccountTypeMiddleware = require("./../../utils/middleware/get-account-type-middleware");
const { accountManager, billingManager } = require("./../../managers");
const validators = require("./../../utils/validators/billing-route-validators");
const dateUtils = require("./../../utils/dates");
const yauzl = require("yauzl");
const ERROR_CODES = require("./../../error-codes");

/**
 * PATCH account auto-payment details
 *
 * Request param strings
 * @param {string} accountId(required)  The account id to update automatic-payment for.
 *
 * Request body object
 * @param {boolean} enabled(required)  If true, activates automatic-payment for this account.
 * @param {boolean} onDeclineSuspend(optional)  If true, suspends service account on rejection.
 * @param {string} paymentSource(optional)  The source of the payment that will be made when an automatic payment is
 *      triggered. (Required if enabled flag is set to true).
 *      Allowed Values: CREDITCARD, BANKACCOUNT, default: CREDITCARD
 * @param {object} creditCard(optional)
 * {
 *    @param {string} cardType(required)  The type of credit card, for example VISA. Allowed Values: VISA, MASTERCARD,
 *        AMEX
 *    @param {string} number(required)  The credit card number.
 *    @param {string} holder(required)  The credit card holder's name.
 *    @param {string} expMonth(required)  The credit card expiry month. Ex: '04'.
 *    @param {string} expYear(required)  The credit card expiry year. Ex: '2017'.
 *    @param {string} CVV(required)  The credit card security code. Ex: '104 or '7612'.
 * }
 * @param {object} onDaysAvailable(optional) Object describing the payment details on remaining days available.
 * {
 *    @param {boolean} enabled(required)  If true, triggers an automatic payment when the amount of days remaining in
 *           this account's subscription drops below a specific threshold.
 *    @param {integer} trigger(required)  The threshold for the amount of days to trigger an automatic payment.
 *            If set to 1, will trigger an automatic payment when there is 1 or fewer days remaining in the account's
 *            subscription.
 *    @param {number} amount(required)  If days available trigger conditions are met, the payment amount that is
 *            debited to the stored payment method associated with the account.
 * }
 * @param {object} onDayOfMonth(optional) Object describing the payment details on a specific day of month. {
 * {
 *    @param {boolean} enabled(required)  If true, triggers an automatic payment on a specific day of the month.
 *    @param {integer} trigger(required)  The threshold for the day of month to trigger an automatic payment.
 *           If set to 15, will trigger an automatic payment on the 15th day of every month.
 *    @param {number} amount(required)  If day of month trigger conditions are met, the payment amount that is debited
 *           to the stored payment method associated with the account.
 * }
 * @param {object} onBalanceBelow(optional) Object describing the payment details on a balance threshold. {
 * {
 *    @param {boolean} enabled(required)  If true, triggers an automatic payment when the account balance falls
 *            below a specified threshold (balance).
 *    @param {integer} trigger(required)  The threshold for the balance to trigger an automatic payment.
 *           If set to 2, will trigger an automatic payment when there is $2 or less remaining in the account's balance.
 *    @param {number} amount(required)  If day of month trigger conditions are met, the payment amount that is debited
 *           to the stored payment method associated with the account.
 * }
 */
router.patch(
  "/:accountId/automatic-payment",
  getAccountTypeMiddleware,
  (req, res, next) => {
    const accountCode = req.params.accountId;
    logger.info(
      `PATCH:  update auto-payment details for account #${accountCode}`
    );
    const account = req.account;
    if (!account.billable) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 2081,
              message: ERROR_CODES[2081]
            }
          ]
        })
      );
    }
    const isPrePaidAccount = account.billingType.toLowerCase() !== "postpaid";
    req.checkBody(validators.patch.automaticPayment.body);
    if (isPrePaidAccount) {
      if (req.body.onDaysAvailable) {
        req.checkBody(validators.patch.automaticPayment.onDaysAvailable);
        if (process.env.NODE_ENV !== "production") {
          req.body.onDaysAvailable.amount = parseInt(
            req.body.onDaysAvailable.amount
          );
        }
      }
      if (req.body.onDayOfMonth) {
        req.checkBody(validators.patch.automaticPayment.onDayOfMonth);
        if (process.env.NODE_ENV !== "production") {
          req.body.onDayOfMonth.amount = parseInt(req.body.onDayOfMonth.amount);
        }
      }
      if (req.body.onBalanceBelow) {
        req.checkBody(validators.patch.automaticPayment.onBalanceBelow);
        if (process.env.NODE_ENV !== "production") {
          req.body.onBalanceBelow.amount = parseInt(
            req.body.onBalanceBelow.amount
          );
        }
      }
    }
    if (req.body.creditCard) {
      req.checkBody(validators.patch.creditCard);
    }
    if (req.body.enabled === true && !req.body.paymentSource) {
      req._validationErrors.push({
        param: "paymentSource",
        msg: "2056",
        location: "body",
        value: req.body.paymentSource
      });
    }
    if (
      req.body.enabled === true &&
      !isPrePaidAccount &&
      (req.body.onDaysAvailable ||
        req.body.onDayOfMonth ||
        req.body.onBalanceBelow)
    ) {
      req._validationErrors.push({
        param: "onDaysAvailable, onDayOfMonth, onBalanceBelow",
        msg: "2057",
        location: "body"
      });
    }
    if (
      req.body.enabled === true &&
      isPrePaidAccount &&
      !req.body.onDaysAvailable &&
      !req.body.onDayOfMonth &&
      !req.body.onBalanceBelow
    ) {
      req._validationErrors.push({
        param: "onDaysAvailable, onDayOfMonth, onBalanceBelow",
        msg: "2058",
        location: "body"
      });
    }
    const tasks = {};
    if (typeof req.body.paymentSource !== "undefined") {
      tasks.paymentinfo = callback => {
        billingManager
          .getPaymentTypeInfoByType({
            type: req.body.paymentSource.toUpperCase(),
            businessUnitId: req._businessUnit.businessUnitId
          })
          .then(paymentinfo => {
            if (!paymentinfo) {
              req._validationErrors.push({
                param: "paymentSource",
                msg: "2059",
                location: "body",
                value: req.body.paymentSource
              });
            }
            callback(null, paymentinfo);
          })
          .catch(callback);
      };
    }
    tasks.validations = callback => {
      req.getValidationResult().then(result => {
        callback(null, result);
      });
    };
    async.series(tasks, async (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.validations.isEmpty()) {
        return next(
          validationError({
            errors: results.validations.array()
          })
        );
      } else {
        const body = Object.assign({}, req.body);
        const params = {};
        params.automaticPayment = req.body;
        params.automaticPayment.paymentType = results.paymentinfo.paymentCode;
        params.automaticPayment.adapter = results.paymentinfo.adapterCode;
        try {
          if (body.creditCard) {
            body.creditCard.cardType = body.creditCard.cardType.toUpperCase();
          }
          await billingManager.updateAutomaticPayments(
            Object.assign(params, {
              accountId: account.ID,
              accountCode,
              businessUnit: req._businessUnit
            })
          );
          if (body.creditCard) {
            let last4digits = body.creditCard.number.substr(-4);
            body.creditCard.last4digits = last4digits;
            delete body.creditCard.number;
          }
          return res.json(body);
        } catch (e) {
          return next(e);
        }
      }
    });
  }
);
/**
 * GET account balance
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to retrieve the balance for.
 */
router.get(
  "/:accountId/balance",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  get balance for account/service #${accountId}`);
    try {
      const balance = await billingManager.getBalance({
        accountId,
        businessUnit: req._businessUnit
      });
      return res.json(balance);
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * GET account invoices
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to retrieve invoices for.
 *
 * Request query strings
 * @param {integer} status(optional)  Use 0 for Open (not paid) or 2 for Closed (paid). If not supplied, request will
 *        return both open and closed invoices.  Allowed Values: 0, 2
 * @param {string} fromDate(optional) In format YYYY-MM-DD
 * @param {string} toDate(optional) In format YYYY-MM-DD
 */
router.get(
  "/:accountId/invoices",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  get invoices for account/service #${accountId}`);
    const params = {
      filters: {}
    };
    req.checkQuery(validators.get.invoices);
    let result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        let _toDate = null;
        let _fromDate = null;
        if (req.query.status) {
          params.status = req.query.status;
        }
        if (req.query.fromDate && dateUtils.isValidDate(req.query.fromDate)) {
          _fromDate = req.query.fromDate;
          params.filters.fromDate = _fromDate; //.replace(/-/g, "");
        }
        if (req.query.toDate && dateUtils.isValidDate(req.query.toDate)) {
          _toDate = req.query.toDate;
          params.filters.toDate = _toDate; //.replace(/-/g, "");
        }
        if (_fromDate && _toDate) {
          if (_fromDate >= _toDate) {
            req._validationErrors.push({
              param: "fromDate/toDate",
              msg: "2060",
              location: "query",
              value: "From: " + req.query.fromDate + " To: " + req.query.toDate
            });
          }
        }
        result = await req.getValidationResult();
        if (!result.isEmpty()) {
          return next(
            validationError({
              errors: result.array()
            })
          );
        }
        const invoices = await billingManager.getInvoices(
          Object.assign(params, {
            accountId,
            businessUnit: req._businessUnit
          })
        );
        return res.json(invoices);
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * GET account/service invoice
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id of the invoice to retireve.
 * @param {string} invoiceId(required)  The invoice id of the invoice to retireve.
 */
router.get(
  "/:accountId/invoices/:invoiceId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const invoiceId = req.params.invoiceId;
    logger.info(`GET:  get invoice #${invoiceId}`);
    try {
      const invoice = await billingManager.getInvoice({
        accountId,
        invoiceId,
        businessUnit: req._businessUnit
      });
      return res.json(invoice);
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * GET account/service invoice
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id of the invoice to retireve.
 * @param {string} invoiceId(required)  The invoice id of the invoice to retireve.
 */
router.get(
  "/:accountId/invoices/:invoiceId/download",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const invoiceId = req.params.invoiceId;
    logger.info(`GET:  download invoice #${invoiceId}`);
    try {
      const invoice = await billingManager.getInvoiceImage({
        accountId,
        invoiceId,
        businessUnit: req._businessUnit
      });
      res.set({
        "Content-Disposition":
          "attachment; filename=invoice-" + invoiceId + ".pdf",
        "Content-Type": "application/pdf"
      });
      // res.send(Buffer.from(invoice.data, "binary"));
      yauzl.fromBuffer(
        Buffer.from(invoice.data, "binary"),
        {
          autoClose: true,
          lazyEntries: true,
          decodeStrings: true,
          validateEntrySizes: true
        },
        (err, zipfile) => {
          if (err) {
            return next(err);
          } else {
            zipfile.readEntry();
            zipfile.on("entry", entry => {
              if (/\/$/.test(entry.fileName)) {
                // Directory file names end with '/'.
                // Note that entires for directories themselves are optional.
                // An entry's fileName implicitly requires its parent directories to exist.
                zipfile.readEntry();
              } else {
                // file entry
                zipfile.openReadStream(entry, (err, readStream) => {
                  if (err) {
                    throw err;
                  }
                  readStream.on("end", () => {
                    zipfile.readEntry();
                  });
                  readStream.pipe(res);
                });
              }
            });
          }
        }
      );
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * POST make payment on account/service
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to make a payment for.
 *
 * Request body object
 * @param {string} paymentMethod (required) A string representing the method of payment that was made.
 * @param {string} reference (optional) A unique reference associated with the transaction provider specific to the
 *    payment.
 * @param {boolean} isServicePayment (optional) Boolean to indicate if payment is for service. ONLY for PIA accounts.
 * @param {string} remark (optional) A general text remark regading this payment.
 * @param {number} amount(required)  The amount of the payment to be applied to the account.
 * @param {string} currency(required)  The currency of the payment to be applied to the account.
 *        For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php.
 */
router.post(
  "/:accountId/payments",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    // Always set taxesIncluded to TRUE
    req.body.taxesIncluded = true;
    logger.info(`POST:  make payment for account #${accountId}`);
    req.checkBody(validators.post.payment);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      req.body.paymentMethod = req.body.paymentMethod.toUpperCase();
      req.body.currency = req.body.currency.toUpperCase();
      const params = Object.assign(req.body, {
        accountId,
        businessUnit: req._businessUnit
      });
      try {
        if (req.account.billingType.toLowerCase() === "postpaid") {
          params.isServicePayment = false;
        }
        const payment = await billingManager.addPayment(params);
        payment.amount = params.amount;
        payment.currency = params.currency;
        payment.remark = params.remark || null;
        payment.paymentMethod = params.paymentMethod;
        payment.reference = params.reference || null;
        return res.json(payment);
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * GET account adjustments
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to retrieve the adjustments for.
 *
 * Request query strings
 *    @param {string} fromDate(optional)  The starting date to get the adjustments for in format YYYY-MM-DD.
 *    @param {string} toDate(optional)  The ending date to get the adjustments for in format YYYY-MM-DD.
 */
router.get(
  "/:accountId/adjustments",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  get adjustments for account/service #${accountId}`);
    const params = {
      filters: {}
    };
    req.checkQuery(validators.get.adjustments);
    let result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        let _toDate = null;
        let _fromDate = null;
        if (req.query.fromDate && dateUtils.isValidDate(req.query.fromDate)) {
          _fromDate = req.query.fromDate;
          params.filters.fromDate = _fromDate; //.replace(/-/g, "");
        }
        if (req.query.toDate && dateUtils.isValidDate(req.query.toDate)) {
          _toDate = req.query.toDate;
          params.filters.toDate = _toDate; //.replace(/-/g, "");
        }
        if (_fromDate && _toDate) {
          if (_fromDate >= _toDate) {
            req._validationErrors.push({
              param: "fromDate/toDate",
              msg: "2060",
              location: "query",
              value: "From: " + req.query.fromDate + " To: " + req.query.toDate
            });
          }
        }
        result = await req.getValidationResult();
        if (!result.isEmpty()) {
          return next(
            validationError({
              errors: result.array()
            })
          );
        }
        const adjustments = await billingManager.getAdjustments(
          Object.assign(params, {
            accountId: req.account.ID,
            accountCode: accountId,
            businessUnit: req._businessUnit
          })
        );
        return res.json(adjustments);
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * GET account adjustment
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to retrieve the adjustment for.
 * @param {int} adjustmentId(required)  The adjustment id to retrieve.
 */
router.get(
  "/:accountId/adjustments/:adjustmentId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const adjustmentId = req.params.adjustmentId;
    logger.info(
      `GET:  get adjustment #${adjustmentId} for account/service #${accountId}`
    );
    try {
      const adjustment = await billingManager.getAdjustment({
        accountId: req.account.ID,
        accountCode: accountId,
        adjustmentId,
        businessUnit: req._businessUnit
      });
      return res.json(adjustment);
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * DELETE account adjustment
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to delete the adjustment for.
 * @param {int} adjustmentId(required)  The adjustment id to delete.
 */
router.delete(
  "/:accountId/adjustments/:adjustmentId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const adjustmentId = req.params.adjustmentId;
    logger.info(
      `DELETE:  delete adjustment #${adjustmentId} for account/service #${accountId}`
    );
    try {
      const adjustment = await billingManager.deleteAdjustment({
        accountId: req.account.ID,
        accountCode: accountId,
        adjustmentId,
        businessUnit: req._businessUnit
      });
      return res.json(adjustment);
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * POST make an adjustment on account/service
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to make an adjustment for.
 *
 * Request body object
 * @param {string} type (required) A string representing the method of payment that was made.
 * @param {number} amount(required)  The amount of the payment to be applied to the account.
 * @param {string} currency(required)  The currency of the payment to be applied to the account.
 *        For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php.
 * @param {boolean} taxIncluded(required)  Boolean to indicate if taxes are included applying adjustment.
 * @param {string} taxGroup(optional) The tax group of the adjustment.
 * @param {boolean} bypassValidations(optional)  Boolean to indicate if validations should be bypassed when applying adjustment.
 * @param {string} reference(optional)  A note to accompany the adjustment.
 * @param {string} date(optional)  The date of the adjustment. Format yyyy-mm-dd.
 * @param {boolean} immediate(optional)  Boolean to indicate if adjustment is applied immediately.
 * @param {string} balanceType(optional)  Specifies if the adjustment balance is "account", "tab" or "moneywallet".
 */
router.post(
  "/:accountId/adjustments",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`POST:  make adjustment for account #${accountId}`);
    req.body.taxIncluded = true;
    req.body.immediate = true;
    req.body.bypassValidations = true;
    //not supported for now
    delete req.body.date;
    delete req.body.taxGroup;
    delete req.body.balanceType;
    req.body.date = format(new Date(), "YYYY-MM-DD");
    req.checkBody(validators.post.adjustment);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        req.body.currency = req.body.currency.toUpperCase();
        const adjustment = await billingManager.addAdjustment(
          Object.assign(req.body, {
            accountId,
            businessUnit: req._businessUnit
          })
        );
        return res.json(
          Object.assign(adjustment, {
            type: req.body.type.toUpperCase(),
            amount: req.body.amount,
            reference: req.body.reference || "",
            currency: req.body.currency.toUpperCase()
          })
        );
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * POST account/service invoice
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to post an invoice for.
 *
 * Request body object
 * @param {boolean} forceGeneration(optional)  Indicates whether to force invoice generation. Defaults to true.
 * @param {boolean} subtree(optional) Generates invoices for all billable descendants as well. Defaults to false.
 * @param {array} adjustments(required) Generates invoice with the provided adjustments included.
 * @param {object} billing(optional) Object with details about billing.
 * {
 *   @param {string} endDate(required) Defaults to today.  Format YYYY-MM-DD.
 *   @param {boolean} includeTransactions(optional) Include transactions until endDate. Default is false.
 * }
 * @param {object} paymentTerms(optional) Object with details about the payment terms.
 * {
 *   @param {string} type(required) The type of payment term
 *   @param {number} days(required) Number of payment terms (starting from invoice generation) or Fixed day
 *       of the month when payment terms are ended -> Depending on "type"
 * }
 * @param {boolean} forceShipment(optional)  Indicates whether to force the shipment of the invoice. Defaults to false.
 * @param {number} layout(optional) Invoice layout ID.
 */
router.post(
  "/:accountId/invoices",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`POST:  generate an invoice for account #${accountId}`);
    req.checkBody(validators.post.invoice);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        const invoice = await billingManager.generateInvoice({
          accountId,
          language: req.account.language,
          adjustments: req.body.adjustments,
          businessUnit: req._businessUnit
        });
        return res.json(invoice);
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * GET account payments
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to retrieve the payments for.
 *
 * Request query strings
 *    @param {string} fromDate(optional)  The starting date to get the payments for in format YYYY-MM-DD.
 *    @param {string} toDate(optional)  The ending date to get the payments for in format YYYY-MM-DD.
 *    @param {string} reference(optional)  The reference id to get the payment for.
 */
router.get(
  "/:accountId/payments",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  get payments for account/service #${accountId}`);
    req.checkQuery(validators.get.payments);
    const reference = req.query.reference;
    let result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        let _toDate = null;
        let _fromDate = null;
        if (req.query.fromDate && dateUtils.isValidDate(req.query.fromDate)) {
          _fromDate = req.query.fromDate;
        }
        if (req.query.toDate && dateUtils.isValidDate(req.query.toDate)) {
          _toDate = req.query.toDate;
        }
        if (_fromDate && _toDate) {
          if (_fromDate >= _toDate) {
            req._validationErrors.push({
              param: "fromDate/toDate",
              msg: "2060",
              location: "query",
              value: "From: " + req.query.fromDate + " To: " + req.query.toDate
            });
          }
        }
        result = await req.getValidationResult();
        if (!result.isEmpty()) {
          return next(
            validationError({
              errors: result.array()
            })
          );
        }
        const payments = await billingManager.getPayments({
          accountId,
          filters: {
            reference,
            fromDate: _fromDate,
            toDate: _toDate
          },
          businessUnit: req._businessUnit
        });
        return res.json(payments);
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * GET account payment
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to retrieve the payment for.
 * @param {int} paymentId(required)  The payment id to retrieve.
 */
router.get(
  "/:accountId/payments/:paymentId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const paymentId = req.params.paymentId;
    logger.info(
      `GET:  get payment #${paymentId} for account/service #${accountId}`
    );
    try {
      const payment = await billingManager.getPayment({
        accountId,
        paymentId,
        businessUnit: req._businessUnit
      });
      return res.json(payment);
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * POST cancel/reverse account payment
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to reverse/cancel a payment for.
 * @param {string} paymentId(required)  The payment id to reverse/cancel.
 */
router.post(
  "/:accountId/payments/:paymentId/reverse",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const paymentId = req.params.paymentId;
    logger.info(
      `POST:  reverse/cancel payment #${paymentId} for account/service #${accountId}`
    );
    try {
      const response = await billingManager.cancelPayment({
        accountId,
        paymentId,
        businessUnit: req._businessUnit
      });
      return res.json(response);
    } catch (e) {
      return next(e);
    }
  }
);
/**
 * GET tax groups
 *
 * Request query strings
 *  @param {string} province(optional) The province to get the tax rates for.
 *
 */
// router.get("/taxrates", async (req, res, next) => {
//   logger.info(`GET:  tax rates`);
//   try {
//     const taxRates = await billingManager.getTaxRates({
//       province: req.query.province
//     });
//     res.json(taxRates);
//   } catch (e) {
//     next(e);
//   }
// });
/**
 * POST account/service deposit
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to add a deposit for.
 *
 * Request body object
 * @param {string} type(required) The type of deposit.
 * @param {string} currency(required) The currency of the deposit to be applied to the account.
 *      For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php
 * @param {number} amount(required) The amount of the deposit.
 * @param {string} note(optional) A note regarding the deposit.
 */
router.post(
  "/:accountId/deposits",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`POST:  add a deposit for account #${accountId}`);
    req.checkBody(validators.post.deposit);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        const params = {
          type: req.body.type.toUpperCase(),
          currency: req.body.currency,
          amount: req.body.amount,
          note: req.body.note
        };
        const deposit = await billingManager.addDeposit(
          Object.assign(
            {
              accountId: req.account.ID,
              accountCode: accountId,
              businessUnit: req._businessUnit
            },
            params
          )
        );
        return res.json(Object.assign(params, deposit));
      } catch (e) {
        return next(e);
      }
    }
  }
);

/**
 * DELETE account/service deposit
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to delete a deposit for.
 * @param {string} depositId(required)  The deposit id to delete.
 *
 */
router.delete(
  "/:accountId/deposits/:depositId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const depositId = req.params.depositId;
    logger.info(
      `DELETE:  delete deposit ${depositId} for account #${accountId}`
    );
    try {
      const deposit = await billingManager.deleteDeposit({
        accountId: req.account.ID,
        accountCode: accountId,
        depositId,
        businessUnit: req._businessUnit
      });
      return res.json(deposit);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * PATCH account/service deposit
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to update a deposit for.
 * @param {string} depositId(required)  The deposit id to update.
 * @param {string} note(required)  A note to add/update to the deposit.
 *
 */
router.patch(
  "/:accountId/deposits/:depositId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const depositId = req.params.depositId;
    logger.info(
      `PATCH:  update deposit ${depositId} for account #${accountId}`
    );
    req.checkBody(validators.patch.deposit);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        const deposit = await billingManager.updateDeposit({
          accountId: req.account.ID,
          accountCode: accountId,
          depositId,
          note: req.body.note,
          businessUnit: req._businessUnit
        });
        return res.json(deposit);
      } catch (e) {
        return next(e);
      }
    }
  }
);

/**
 * GET account/service deposit
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to get a deposit for.
 * @param {string} depositId(required)  The deposit id to retrieve.
 *
 */
router.get(
  "/:accountId/deposits/:depositId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const depositId = req.params.depositId;
    logger.info(
      `GET:  retrieve deposit ${depositId} for account #${accountId}`
    );
    try {
      const deposit = await billingManager.getDeposit({
        accountId: req.account.ID,
        accountCode: accountId,
        depositId,
        businessUnit: req._businessUnit
      });
      return res.json(deposit);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * GET a list of deposits based on specific filters.
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to get deposits for.
 *
 * Request query strings
 *  @param {Array} status(optional) Comma-delimited status strings.
 * 	@param {string} paymentId(optional)
 * 	@param {string} refundId(optional)
 *	@param {string} fromDate(optional) The starting date to get the deposits for in format YYYY-MM-DD.
 *	@param {string} toDate(optional) The ending date to get the deposits for in format YYYY-MM-DD.
 *	@param {string} type(optional)
 *  @param {string} productCode(optional)
 * }
 */
router.get(
  "/:accountId/deposits",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  retrieve deposits for account #${accountId}`);
    req.checkQuery(validators.get.deposits);
    let result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        const statuses =
          (req.query.status && req.query.status.split(",")) || null;
        if (statuses && statuses.length) {
          const notFound = statuses.find(status => {
            return (
              ["OPEN", "PAIN", "RETURNED", "DELETED"].indexOf(
                status && status.toUpperCase()
              ) < 0
            );
          });
          if (notFound) {
            req._validationErrors.push({
              param: "status",
              msg: "2063",
              location: "query",
              value: req.query.status
            });
          }
        }
        const params = {
          filters: {}
        };
        let _toDate = null;
        let _fromDate = null;
        if (req.query.fromDate) {
          if (dateUtils.isValidDate(req.query.fromDate)) {
            _fromDate = req.query.fromDate;
            params.filters.fromDate = _fromDate; //.replace(/-/g, "");
          } else {
            req._validationErrors.push({
              param: "fromDate",
              msg: "2061",
              location: "query",
              value: req.query.fromDate
            });
          }
        }
        if (req.query.toDate) {
          if (dateUtils.isValidDate(req.query.toDate)) {
            _toDate = req.query.toDate;
            params.filters.toDate = _toDate; //.replace(/-/g, "");
          } else {
            req._validationErrors.push({
              param: "toDate",
              msg: "2062",
              location: "query",
              value: req.query.toDate
            });
          }
        }
        if (_fromDate && _toDate) {
          if (_fromDate >= _toDate) {
            req._validationErrors.push({
              param: "fromDate/toDate",
              msg: "2060",
              location: "query",
              value: "From: " + req.query.fromDate + " To: " + req.query.toDate
            });
          }
        }
        result = await req.getValidationResult();
        if (!result.isEmpty()) {
          return next(
            validationError({
              errors: result.array()
            })
          );
        }
        const deposits = await billingManager.getDeposits(
          Object.assign(
            {
              accountId: req.account.ID,
              accountCode: accountId,
              businessUnit: req._businessUnit
            },
            params
          )
        );
        return res.json(deposits);
      } catch (e) {
        return next(e);
      }
    }
  }
);

/**
 * PATCH account credit-card details
 *
 * Request param strings
 * @param {string} accountId(required)  The account id to update the credit card info for.
 *
 * Request body object
 *    @param {string} cardType(required)  The type of credit card, for example VISA. Allowed Values: VISA, MASTERCARD,
 *        AMEX
 *    @param {string} number(required)  The credit card number.
 *    @param {string} holder(required)  The credit card holder's name.
 *    @param {string} expMonth(required)  The credit card expiry month. Ex: '04'.
 *    @param {string} expYear(required)  The credit card expiry year. Ex: '2017'.
 *    @param {string} CVV(required)  The credit card security code. Ex: '104 or '7612'.
 */
router.patch(
  "/:accountId/credit-card",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountCode = req.params.accountId;
    logger.info(
      `PATCH:  update credit card details for account #${accountCode}`
    );
    const account = req.account;
    const isBillable = account.billable;
    if (!isBillable) {
      return next(
        genericError({
          message:
            "Credit Card update is not allowed on non billable accounts.",
          status: 403,
          type: "ValidationError",
          code: 2073
        })
      );
    }
    req.checkBody(validators.patch.onlyCreditCard);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    }
    const body = req.body;
    const params = Object.assign(
      {},
      {
        creditCard: req.body
      }
    );
    try {
      params.creditCard.cardType = params.creditCard.cardType.toUpperCase();
      await billingManager.updateCreditCard(
        Object.assign(params, {
          accountId: account.ID,
          accountCode,
          businessUnit: req._businessUnit
        })
      );
      let last4digits = body.number.substr(-4);
      body.last4digits = last4digits;
      delete body.number;
      return res.json(body);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * DELETE account credit-card details
 *
 * Request param strings
 * @param {string} accountId(required)  The account id to update the credit card info for.
 *
 */
router.delete(
  "/:accountId/credit-card",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountCode = req.params.accountId;
    logger.info(`DELETE:  delete credit card for account #${accountCode}`);
    const account = req.account;
    try {
      let params = {
        accountId: account.ID,
        businessUnit: req._businessUnit
      };
      // if (!account.isMaster) {
      //   params.flatRateTariff = account.flatRateTariff;
      // }

      let acct = await accountManager.getAccount(params);
      if (acct.automaticPayment.enabled) {
        await billingManager.updateAutomaticPayments({
          automaticPayment: {
            enabled: false
          },
          accountId: account.ID,
          accountCode,
          businessUnit: req._businessUnit
        });
      }

      await billingManager.deleteCreditCard({
        accountId: account.ID,
        accountCode,
        businessUnit: req._businessUnit
      });
      return res.json({});
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * GET a list of packages for the specified account
 *
 * Request param strings
 * @param {string} accountId(required)  The account/service id to get packages for.
 *
 */
router.get(
  "/:accountId/packages",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  retrieve packages for account #${accountId}`);
    try {
      const account = req.account;
      // if (!account.isMaster) {
      //   return next(
      //     genericError({
      //       message: "Package list available only on master accounts.",
      //       status: 403,
      //       type: "ValidationError",
      //       code: 2082
      //     })
      //   );
      // }
      // if (["NEW", "ACTIVE", "SUSPENDED"].indexOf((account.status || "").toUpperCase()) < 0) {
      //   return next(
      //     genericError({
      //       status: 403,
      //       code: 403,
      //       errors: [
      //         {
      //           code: 10037,
      //           message: ERROR_CODES[10037]
      //         }
      //       ]
      //     })
      //   );
      // }
      const packages = await billingManager.getPackages({
        accountId: req.account.ID,
        accountCode: accountId,
        businessUnit: req._businessUnit
      });
      return res.json(packages);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * DELETE account package
 *
 * Request param strings
 * @param {string} accountId(required)  The account id to delete a package for.
 * @param {string} packageId(required)  The package id to delete.
 *
 */
router.delete(
  "/:accountId/packages/:packageId",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const packageId = req.params.packageId;
    logger.info(
      `DELETE:  delete package ${packageId} for account #${accountId}`
    );
    try {
      const account = req.account;
      // if (!account.isMaster) {
      //   return next(
      //     genericError({
      //       message: "Delete package available only on master accounts.",
      //       status: 403,
      //       type: "ValidationError",
      //       code: 2084
      //     })
      //   );
      // }
      if (
        ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
          (account.status || "").toUpperCase()
        ) < 0
      ) {
        return next(
          genericError({
            status: 403,
            code: 403,
            errors: [
              {
                code: 10037,
                message: ERROR_CODES[10037]
              }
            ]
          })
        );
      }
      const pkg = await billingManager.deletePackage({
        accountId: req.account.ID,
        accountCode: accountId,
        packageId,
        businessUnit: req._businessUnit
      });
      return res.json(pkg);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * POST add an account package
 *
 * Request param strings
 * @param {string} accountId(required)  The account id to add a package for.
 *
 * Request body object
 *    @param {string} code(required)  The package code to add
 *    @param {object} config(optional)  A config object with any necessary properties for the package
 */
router.post(
  "/:accountId/packages",
  getAccountTypeMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`POST:  add package to account #${accountId}`);
    try {
      req.checkBody(validators.post.package);
      const result = await req.getValidationResult();
      if (!result.isEmpty()) {
        return next(
          validationError({
            errors: result.array()
          })
        );
      }
      const account = req.account;
      // if (!account.isMaster) {
      //   return next(
      //     genericError({
      //       message: "Add package available only on master accounts.",
      //       status: 403,
      //       type: "ValidationError",
      //       code: 2083
      //     })
      //   );
      // }
      if (
        ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
          (account.status || "").toUpperCase()
        ) < 0
      ) {
        return next(
          genericError({
            status: 403,
            code: 403,
            errors: [
              {
                code: 10037,
                message: ERROR_CODES[10037]
              }
            ]
          })
        );
      }
      const pkg = await billingManager.addPackage(
        Object.assign(
          {},
          {
            accountId: req.account.ID,
            accountCode: accountId,
            businessUnit: req._businessUnit
          },
          { package: req.body }
        )
      );
      return res.json(pkg);
    } catch (e) {
      return next(e);
    }
  }
);
module.exports = router;
