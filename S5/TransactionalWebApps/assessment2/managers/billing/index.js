"use strict";
const db = require("./../../database");
const debug = require("debug")("manager:billing");
const debugTiming = require("debug")("timing");
const logger = require("./../../logger")(module);
const {mindBillService} = require("./../../services");
const creditCardManager = require("./../../managers/credit-card");
const dateUtils = require("./../../utils/dates");
const mathsUtils = require("./../../utils/maths");
const {genericError} = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const format = require("date-fns/format");
const {
  DEPOSIT_STATUSES,
  INVOICE_STATUSES,
  NS_PER_SEC,
  PACKAGE_STATUSES
} = require("./../../utils/constants");

const getStatusString = (status_hash, status) => {
  return status_hash[status] || "unknown";
};
const balanceTypes = {
  account: "account",
  tab: "tab",
  moneywallet: "money_wallet"
};
const getBalanceType = type => {
  return balanceTypes[type] || null;
};
/**
 * Class that handles any/all functionality related to billing.
 */
module.exports = {
  /**
   * Get invoices for a particular account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account to get the invoice for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   *    @param {integer} status(optional)  Use 0 for Open (not paid) or 2 for Closed (paid). If not supplied, request
   *      will return both open and closed invoices.  Allowed Values: 0, 2
   *    @param {object} filters(optional) The filter object to use. {
   *        @param {string} fromDate(optional) In format YYYY-MM-DD
   *        @param {string} toDate(optional) In format YYYY-MM-DD
   *    }
   * }
   */
  async getInvoices(params = {}) {
    logger.info("BillingManager getInvoices");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Invoices failed due to: One of required accountId and/or businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    try {
      if (params.filters) {
        if (params.filters.fromDate) {
          params.filters.fromDate = params.filters.fromDate.replace(/-/g, "");
        }
        if (params.filters.toDate) {
          params.filters.toDate = params.filters.toDate.replace(/-/g, "");
        }
      }
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getInvoices",
        errorMessage: "Get Invoices failed.",
        throwError: true
      });

      const invoices = (
        $("response")
          .find("invoice")
          .toArray() || []
      ).map(invoice => {
        let total =
          parseFloat(
            $(invoice)
              .find("curramount")
              .text()
          ) || 0;
        let subtotal =
          parseFloat(
            $(invoice)
              .find("curramountbeforetax")
              .text()
          ) || 0;
        let taxes = Number(Math.round(total - subtotal + "e2") + "e-2");
        let currentBalance =
          -1 *
            parseFloat(
              $(invoice)
                .find("account_balance")
                .text()
            ) || 0;
        let previousBalance =
          parseFloat(
            $(invoice)
              .find("previous_amount_to_pay")
              .text()
          ) || 0;
        let dueDate = dateUtils.formatDate(
          $(invoice)
            .find("duedate")
            .text()
        );
        let startDate = dateUtils.formatDate(
          $(invoice)
            .find("begindate")
            .text()
        );
        let endDate = dateUtils.formatDate(
          $(invoice)
            .find("enddate")
            .text()
        );
        let issueDate = dateUtils.formatDate(
          $(invoice)
            .find("invoice_date")
            .text()
        );
        let status = $(invoice)
          .find("status")
          .text();
        return {
          invoiceId: $(invoice).attr("id"),
          invoiceNumber: $(invoice)
            .find("fullnumber")
            .text(),
          total,
          subtotal,
          taxes,
          currentBalance,
          previousBalance,
          dueDate,
          startDate,
          endDate,
          issueDate,
          status: getStatusString(INVOICE_STATUSES, status)
        };
      });
      return {
        invoices
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getInvoices took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get specified invoice for a particular account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account to get the invoice for.
   *    @param {string} invoiceId(required)  The invoice to retrieve.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getInvoice(params = {}) {
    logger.info("BillingManager getInvoice");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.invoiceId === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Invoice failed due to: One of required accountId, invoiceId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const result = await this.getInvoices(params);
      const invoice = result.invoices.find(item => {
        return params.invoiceId === item.invoiceId;
      });
      if (!invoice) {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10022,
              message: ERROR_CODES[10022]
            }
          ]
        });
      } else {
        return invoice;
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getInvoice took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get image of specified invoice for a particular account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account to get the invoice for.
   *    @param {string} invoiceId(required)  The invoice to retrieve.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getInvoiceImage(params = {}) {
    logger.info("BillingManager getInvoiceImage");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.invoiceId === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Invoice Image failed due to: One of required accountId, invoiceId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const result = await this.getInvoices({
        accountId: params.accountId,
        businessUnit: params.businessUnit
      });
      const invoice = result.invoices.find(item => {
        return params.invoiceId === item.invoiceId;
      });
      if (!invoice) {
        logger.error(
          `Error trying to retrieve Invoice Id: ${params.invoiceId} on account ${params.accountId} due to Not Found.`
        );
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10022,
              message: ERROR_CODES[10022]
            }
          ]
        });
      }
      params.hasAttachment = true;
      const { data } = await mindBillService.execute({
        data: params,
        operation: "getInvoiceImage",
        errorMessage: "Get Invoice Image failed.",
        throwError: true
      });

      return {
        data: data.multipart,
        mimeTypes: {
          "Content-Type": "application/zip",
          "Content-Transfer-Encoding": "binary"
        }
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getInvoiceImage took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Update automatic payment on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to make a payment for.
   *    @param {string} accountCode(required)  The account code to make a payment for.
   *    @param {object} automaticPayment(optional) Object describing the automatic payment details.
   *    {
   *      @param {boolean} onDeclineSuspend(optional)  If true, suspends account on rejection.
   *      @param {boolean} enabled(optional)  If true, activates automatic payments for this account.
   *      @param {string} paymentSource(optional)  The type of payment that will be made when an automatic payment is
   *          triggered. (Required if enabled flag is set to true).
   *      @param {object} onDaysAvailable(optional) Object describing the payment details on remaining days available.
   *      {
   *          @param {boolean} enabled(required)  If true, triggers an automatic payment when the amount of days
   *            remaining in this account's subscription drops below a specific threshold.
   *          @param {integer} trigger(required)  The threshold for the amount of days to trigger an automatic payment.
   *            If set to 1, will trigger an automatic payment when there is 1 or fewer days remaining in the account's
   *            subscription.
   *          @param {number} amount(required)  If days available trigger conditions are met, the payment amount that is
   *            debited to the stored payment method associated with the account.
   *      }
   *      @param {object} onDayOfMonth(optional) Object describing the payment details on a specific day of month. {
   *      {
   *          @param {boolean} enabled(required)  If true, triggers an automatic payment on a specific day of the month.
   *          @param {integer} trigger(required)  The threshold for the day of month to trigger an automatic payment.
   *            If set to 15, will trigger an automatic payment on the 15th day of every month.
   *          @param {number} amount(required)  If day of month trigger conditions are met, the payment amount that is
   *            debited to the stored payment method associated with the account.
   *      }
   *      @param {object} onBalanceBelow(optional) Object describing the payment details on a balance threshold. {
   *      {
   *          @param {boolean} enabled(required)  If true, triggers an automatic payment when the account balance falls
   *            below a specified threshold (balance).
   *          @param {integer} trigger(required)  The threshold for the balance to trigger an automatic payment.
   *            If set to 2, will trigger an automatic payment when there is $2 or less remaining in the account's
   *            balance.
   *          @param {number} amount(required)  If day of month trigger conditions are met, the payment amount that is
   *            debited to the stored payment method associated with the account.
   *      }
   *      @param {object} creditCard(optional)
   *      {
   *          @param {string} cardType(required)  The type of credit card, for example VISA. Allowed Values: VISA,
   *            MASTERCARD, AMEX
   *          @param {string} number(required)  The credit card number.
   *          @param {string} holder(required)  The credit card holder's name.
   *          @param {string} expMonth(required)  The credit card expiry month. Ex: '04'.
   *          @param {string} expYear(required)  The credit card expiry year. Ex: '2017'.
   *          @param {string} CVV(required)  The credit card security code. Ex: '104 or '7612'.
   *      }
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updateAutomaticPayments(params = {}) {
    logger.info("BillingManager updateAutomaticPayments");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Automatic Payments failed due to: One of required accountId, accountCode and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      let cardinfo = null;
      params.automaticPayment = params.automaticPayment || {};
      if (params.automaticPayment.creditCard) {
        cardinfo = await creditCardManager.addCreditCard({
          businessUnit: params.businessUnit,
          accountId: params.accountId,
          accountCode: params.accountCode,
          creditCard: params.automaticPayment.creditCard
        });
      }
      params.automaticPayment.creditCard = cardinfo;
      await mindBillService.execute({
        data: params,
        operation: "updateAccount",
        errorMessage: "Update Automatic Payments failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager updateAutomaticPayments took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Make payment on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to make a payment for.
   *    @param {number} amount(required)  The amount of the payment to be applied to the account.
   *    @param {string} paymentMethod (required) A string representing the method of payment that was made.
   *    @param {boolean} isServicePayment (optional) Boolean to indicate if payment is for service. ONLY for PIA accounts.
   *    @param {string} reference (optional) A unique reference associated with the transaction provider specific to the
   *        payment.
   *    @param {string} remark (optional) A general text remark regading this payment.
   *    @param {string} currency(required)  The currency of the payment to be applied to the account.
   *        For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php.
   *    @param {boolean} taxesIncluded(required)  If set to true the amount will be recorded as taxes included,
   *        if set to false the amount will be recorded before taxes.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async addPayment(params = {}) {
    logger.info("BillingManager addPayment");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.amount === "undefined" ||
      typeof params.currency === "undefined" ||
      typeof params.taxesIncluded === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Add Payment failed due to: One of required accountId, amount, currency, taxesIncluded and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "addPayment",
        errorMessage: "Add Payment failed.",
        throwError: true
      });
      const payment = $("response").find("payment");
      return {
        paymentId: $(payment).attr("id")
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager addPayment took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Cancel payment on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to cancel a payment for.
   *    @param {number} paymentId(required)  A string representing the payment id to cancel.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async cancelPayment(params = {}) {
    logger.info("BillingManager cancelPayment");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.paymentId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Cancel Payment failed due to: One of required accountId, paymentId, and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "cancelPayment",
        errorMessage: "Cancel Payment failed.",
        throwError: true
      });
      const payment = $("response").find("payment");
      return {
        paymentId: $(payment).attr("id")
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager cancelPayment took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get balance for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account/service id to retrieve the balance for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async getBalance(params = {}) {
    logger.info("BillingManager getBalance");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Balance failed due to: One of required accountId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getBalance",
        errorMessage: "Get Balance failed.",
        throwError: true
      });
      const balanceElement = $("response").find("balance");
      return {
        balance: -1 * parseFloat(balanceElement.text()),
        currency: balanceElement.attr("curr_alpha_code")
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getBalance took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get payment type info.
   *
   * @param {object} params
   * {
   *    @param {string} type(required)  The type of payment.
   *    @param {string} businessUnitId(required) The business unit Id.
   * }
   */
  async getPaymentTypeInfoByType(params = {}) {
    logger.info("BillingManager getPaymentTypeInfoByType");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.type === "undefined" ||
      typeof params.businessUnitId === "undefined"
    ) {
      throw genericError({
        message:
          "Get Payment Info by Type failed due to: One of required type and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT * FROM automaticPaymentAdapters WHERE paymentType = ? AND businessUnit = ?`;
      const values = [params.type, params.businessUnitId];
      const paymentType = await connection.query(query, values);
      // if (paymentType[0].length !== 1) {
      //   throw new Error("Invalid payment source for business unit.");
      // }
      return paymentType[0][0] || null;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getPaymentTypeInfoByType took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get payment type info.
   *
   * @param {object} params
   * {
   *    @param {string} code(required)  The payment code.
   *    @param {string} businessUnitId(required) The business unit Id.
   * }
   */
  async getPaymentTypeInfoByCode(params = {}) {
    logger.info("BillingManager getPaymentTypeInfoByCode");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.code === "undefined" ||
      typeof params.businessUnitId === "undefined"
    ) {
      throw genericError({
        message:
          "Get Payment Info by Code failed due to: One of required code and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT * FROM automaticPaymentAdapters WHERE paymentCode = ? AND businessUnit = ?`;
      const values = [params.code, params.businessUnitId];
      const paymentType = await connection.query(query, values);
      if (paymentType[0].length !== 1) {
        throw genericError({
          message:
            "Get Payment Info by Code failed due to: Invalid payment source for business unit.",
          status: 400,
          code: 400
        });
      }
      return paymentType[0][0];
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getPaymentTypeInfoByCode took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get payments for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account/service id to retrieve the payments for.
   *    @param {object} filters(optional) The filter object to use. {
   *        @param {string} fromDate(optional)  The starting date to get the payments for.
   *        @param {string} toDate(optional)  The ending date to get the payments for.
   *        @param {string} reference(optional)  The reference id to get the payment for.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async getPayments(params = {}) {
    logger.info("BillingManager getPayments");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Payments failed due to: One of required accountId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      if (params.filters) {
        if (params.filters.fromDate) {
          params.filters.fromDate = params.filters.fromDate.replace(/-/g, "");
        }
        if (params.filters.toDate) {
          params.filters.toDate = params.filters.toDate.replace(/-/g, "");
        }
      }
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getPaymentList",
        errorMessage: "Get Payments failed.",
        throwError: true
      });
      const payments = (
        $("response")
          .find("payment")
          .toArray() || []
      ).map(payment => {
        let paymentId = $(payment).attr("id");
        let date = dateUtils.formatDate(
          $(payment)
            .find("date")
            .text()
        );
        let amount = parseFloat(
          $(payment)
            .find("amount")
            .text()
        );
        let currency = $(payment)
          .find("amount")
          .attr("curr_alpha_code");
        let paymentMethod = $(payment)
          .find("method")
          .text();
        let reference =
          $(payment)
            .find("reference_id")
            .text() || null;
        let remark =
          $(payment)
            .find("remark")
            .text() || null;
        // let invoiceNumber =
        //   $(payment)
        //     .find("reported_invoice_no")
        //     .text() || null;
        return {
          paymentId,
          date,
          amount,
          paymentMethod,
          currency,
          remark,
          reference
        };
      });
      return {
        payments
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getPayments took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get payments for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account/service id to retrieve the payment for.
   *    @param {int} paymentId(required)  The payemnt id to retrieve.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async getPayment(params = {}) {
    logger.info("BillingManager getPayment");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.paymentId === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Payment failed due to: One of required accountId, paymentId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const payments = this.getPayments(params);
      const payment = payments.find(item => {
        return params.paymentId === item.paymentId;
      });
      if (!payment) {
        logger.error(
          `Error trying to retrieve Payment Id: ${params.paymentId} on account ${params.accountId} due to Not Found.`
        );
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10034,
              message: ERROR_CODES[10034]
            }
          ]
        });
      }
      return payment;
    } catch (e) {
      logger.error(e);
      throw new Error(
        `Error trying to retrieve Payment Id: ${params.paymentId} on account ${params.accountId} due to: ${e}.`
      );
      // throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getPayment took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get adjustments for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account/service id to retrieve the adjustments for.
   *    @param {string} accountCode(required)  The account/service code to retrieve the adjustments for.
   *    @param {object} filters(required) The filter object to use. {
   *        @param {string} fromDate(optional)  The starting date to get the adjustments for.
   *        @param {string} toDate(optional)  The ending date to get the adjustments for.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async getAdjustments(params = {}) {
    logger.info("BillingManager getAdjustments");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Adjustments failed due to: One of required accountId, accountCode and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      if (params.filters) {
        if (params.filters.fromDate) {
          params.filters.fromDate = params.filters.fromDate.replace(/-/g, "");
        }
        if (params.filters.toDate) {
          params.filters.toDate = params.filters.toDate.replace(/-/g, "");
        }
      }
      params.accountId = [params.accountId];
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getAdjustmentList",
        errorMessage: "Get Adjustments failed.",
        throwError: true
      });
      const adjustments = (
        $("response")
          .find("adjustment")
          .toArray() || []
      ).map(adjustment => {
        let adjustmentId = $(adjustment).attr("id");
        let date = dateUtils.formatDate(
          $(adjustment)
            .find("date")
            .text()
        );
        let amount = parseFloat(
          $(adjustment)
            .find("amount")
            .text()
        );
        let currency = $(adjustment)
          .find("amount")
          .attr("curr_alpha_code");
        let type = $(adjustment)
          .find("type")
          .text();
        // let immediateImpactOnBalance =
        //   $(adjustment)
        //     .find("immediate_impact_on_balance")
        //     .text() === "true";
        let typeDescription = $(adjustment)
          .find("adjustment_type_description")
          .text();
        let reference =
          $(adjustment)
            .find("note")
            .text() || null;
        let invoiceNumber =
          $(adjustment)
            .find("invoice_id")
            .attr("id") || null;
        return {
          adjustmentId,
          date,
          invoiceNumber,
          amount,
          currency,
          type,
          typeDescription,
          reference
        };
      });
      return {
        adjustments
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getAdjustments took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get adjustment for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} adjustmentId(required)  The adjustment id to retrieve.
   *    @param {string} accountCode(required)  The account/service code to retrieve the adjustment for.
   *    @param {string} accountId(required)  The account/service id to retrieve the adjustment for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async getAdjustment(params = {}) {
    logger.info("BillingManager getAdjustment");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.adjustmentId === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Adjustment failed due to: One of required adjustmentId, accountCode, accountId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      params.accountId = [params.accountId];
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getAdjustmentList",
        errorMessage: "Get Adjustment failed.",
        throwError: true
      });
      const adjustmentElement = $("response").find("adjustment");
      const adjustment = adjustmentElement.toArray().filter(_adjustment => {
        return $(_adjustment).attr("id") === params.adjustmentId;
      });
      if (adjustment.length === 1) {
        let adjustmentId = $(adjustment).attr("id");
        let date = dateUtils.formatDate(
          $(adjustment)
            .find("date")
            .text()
        );
        let amount = parseFloat(
          $(adjustment)
            .find("amount")
            .text()
        );
        let currency = $(adjustment)
          .find("amount")
          .attr("curr_alpha_code");
        let type = $(adjustment)
          .find("type")
          .text();
        let typeDescription = $(adjustment)
          .find("adjustment_type_description")
          .text();
        let reference =
          $(adjustment)
            .find("note")
            .text() || null;
        let invoiceNumber =
          $(adjustment)
            .find("invoice_id")
            .attr("id") || null;
        return {
          adjustmentId,
          date,
          invoiceNumber,
          amount,
          currency,
          type,
          typeDescription,
          reference
        };
      } else {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10023,
              message: ERROR_CODES[10023]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getAdjustment took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Delete adjustment for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} adjustmentId(required)  The adjustment id to retrieve.
   *    @param {string} accountId(required)  The account/service id to retrieve the adjustment for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async deleteAdjustment(params = {}) {
    logger.info("BillingManager deleteAdjustment");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.adjustmentId === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Delete Adjustment failed due to: One of required adjustmentId, accountCode, accountId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      await this.getAdjustment(params);
      await mindBillService.execute({
        data: params,
        operation: "deleteAdjustment",
        errorMessage: "Delete Adjustment failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager deleteAdjustment took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Add adjustment for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to add the adjustment for.
   *    @param {boolean} bypassValidations(optional)  Boolean to indicate if validations should be bypassed when applying adjustment.
   *    @param {string} type(required)  The type of adjustment.
   *    @param {number} amount(required)  The amont of the adjustment.
   *    @param {boolean} taxIncluded(required)  Boolean to indicate if taxes are included applying adjustment.
   *    @param {string} taxGroup(optional) The tax group of the adjustment.
   *    @param {string} currency(required)  The currency used to apply the adjustment.
   *    @param {string} reference(optional)  A note to accompany the adjustment.
   *    @param {string} date(optional)  The date of the adjustment. Format YYYY-MM-DD.
   *    @param {boolean} immediate(optional)  Boolean to indicate if adjustment is applied immediately.
   *    @param {string} balanceType(optional)  Specifies if the adjustment balance is "account", "tab" or "moneywallet".
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async addAdjustment(params = {}) {
    logger.info("BillingManager addAdjustment");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.type === "undefined" ||
      typeof params.amount === "undefined" ||
      typeof params.currency === "undefined" ||
      typeof params.taxIncluded === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Add Adjustment failed due to: One of required accountId, type, amount, currency, taxIncluded, and/or businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    try {
      if (params.date) {
        params.date = params.date.replace(/-/g, "");
      }
      params.balanceType = getBalanceType(
        (params.balanceType || "").toLowerCase()
      );
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "addAdjustment",
        errorMessage: "Add Adjustment failed.",
        throwError: true
      });
      const adjustment = $("response").find("adjustment");
      let adjustmentId = $(adjustment).attr("id");
      return {
        adjustmentId
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager addAdjustment took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Generate Invoice for specified account/service.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to generate the invoice for.
   *    @param {string} language(optional)  The language to generate the invoice in. Default to "EN".
   *    @param {boolean} forceGeneration(optional)  Indicates whether to force invoice generation. Defaults to true.
   *    @param {boolean} subtree(optional) Generates invoices for all billable descendants as well.  Defaults to false.
   *    @param {array} adjustments(required) Generates invoice with the provided adjustments included.
   *    @param {object} billing(optional) Object with details about billing.
   *    {
   *      @param {string} endDate(required) Defaults to today.  Format YYYY-MM-DD.
   *      @param {boolean} includeTransactions(optional) Include transactions until endDate. Default is false.
   *    }
   *    @param {object} paymentTerms(optional) Object with details about the payment terms.
   *    {
   *      @param {string} type(required) The type of payment term
   *      @param {number} days(required) Number of payment terms (starting from invoice generation) or Fixed day
   *          of the month when payment terms are ended -> Depending on "type"
   *    }
   *    @param {boolean} forceShipment(optional)  Indicates whether to force the shipment of the invoice. Defaults to false.
   *    @param {number} layout(optional) Invoice layout ID.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async generateInvoice(params = {}) {
    logger.info("BillingManager generateInvoice");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.adjustments === "undefined" ||
      (params && params.adjustments && !params.adjustments.length) ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Generate Invoice failed due to: One of required accountId, adjustments, and/or businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    try {
      params.adjustments = [...params.adjustments];
      params.billing = params.billing || {};
      params.billing.endDate =
        params.billing.endDate || format(new Date(), "YYYYMMDD");
      params.billing.includeTransactions = !!params.billing.includeTransactions;
      params.layout =
        params.businessUnit.config.mind.invoiceOnDemand[
          `layout_${params.language || "EN"}`
        ];
      const { $, parsedError } = await mindBillService.execute({
        data: params,
        operation: "generateInvoiceOnDemand",
        throwError: false
      });
      if (parsedError.code) {
        const code = parsedError.code;
        const message = parsedError.message;
        throw genericError({
          message: "Generate Invoice failed.",
          status: code === "155086" ? 403 : 500,
          code: code === "155086" ? 403 : 500,
          errors: [
            {
              code,
              message
            }
          ]
        });
      }
      const invoiceNumber = $("response")
        .find("invoice_number")
        .text();
      let invoiceId = null;
      try {
        const result = await this.getInvoices({
          accountId: params.accountId,
          businessUnit: params.businessUnit
        });
        const invoice = result.invoices.find(item => {
          return invoiceNumber === item.invoiceNumber;
        });
        if (!invoice) {
          logger.error(
            `Error trying to retrieve Invoice Id from Invoice Number: ${invoiceNumber} on account ${params.accountId} due to invoice not found.`
          );
        } else {
          invoiceId = invoice.invoiceId;
        }
      } catch (e) {
        logger.error(
          `Error trying to retrieve Invoice Id from Invoice Number: ${invoiceNumber} on account ${params.accountId} due to: ${e}`
        );
      }
      return {
        invoiceId,
        invoiceNumber
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager generateInvoice took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get tax rates
   *
   * @param {object} params
   * {
   *    @param {string} province(optional) The province to get the tax rates for.
   * }
   */
  async getTaxRates(params = {}) {
    logger.info("BillingManager getTaxRates");
    const _timeStart = process.hrtime();
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT * FROM taxGroups`;
      let values = [];
      if (typeof params.province !== "undefined") {
        query += " WHERE province = ?";
        values.push(params.province);
      }
      let taxRates = await connection.query(query, values);
      taxRates = (taxRates[0] || []).map(taxRate => {
        return {
          GST: mathsUtils.round(taxRate.GST / 100, 5),
          HST: mathsUtils.round(taxRate.HST / 100, 5),
          PST: mathsUtils.round(taxRate.PST / 100, 5),
          province: taxRate.province
        };
      });
      return taxRates;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getTaxRates took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Add a deposit to an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to add a deposit for.
   *    @param {string} accountCode(required)  The code for the MindBill account to add a deposit for.
   *    @param {string} type(required) The type of deposit.
   *    @param {string} currency(required) TThe currency of the deposit to be applied to the account.
   *        For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php
   *    @param {number} amount(required) The amount if the deposit.
   *    @param {string} note(optional) A note regarding the deposit.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *       services.
   * }
   */
  async addDeposit(params = {}) {
    logger.info("BillingManager addDeposit");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.type === "undefined" ||
      typeof params.currency === "undefined" ||
      typeof params.amount === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Add Deposit failed due to: One of required accountId, accountCode, type, currency, amount and/or businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "addDeposit",
        errorMessage: "Add Deposit failed.",
        throwError: true
      });
      const depositElement = $("response").find("deposit");
      return {
        depositId: depositElement.attr("number")
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager addDeposit took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Delete a deposit from an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to delete a deposit for.
   *    @param {string} accountCode(required)  The code for the MindBill account to delete a deposit for.
   *    @param {string} depositId(required) The deposit to delete.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   * }
   */
  async deleteDeposit(params = {}) {
    logger.info("BillingManager deleteDeposit");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.depositId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Delete Deposit failed due to: One of required accountId, accountCode, depositId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      await this.getDeposit(params);
      await mindBillService.execute({
        data: params,
        operation: "deleteDeposit",
        errorMessage: "Delete Deposit failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager deleteDeposit took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Update a deposit from an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to update a deposit for.
   *    @param {string} accountCode(required)  The code for the MindBill account to update a deposit for.
   *    @param {string} depositId(required) The deposit to update.
   *    @param {string} note(required) A note regarding the deposit.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   * }
   */
  async updateDeposit(params = {}) {
    logger.info("BillingManager updateDeposit");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.depositId === "undefined" ||
      typeof params.note === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Deposit failed due to: One of required accountId, accountCode, depositId, note and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      await this.getDeposit(params);
      await mindBillService.execute({
        data: params,
        operation: "updateDeposit",
        errorMessage: "Update Deposit failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager updateDeposit took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get a deposit from an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to get a deposit for.
   *    @param {string} accountCode(required)  The code for the MindBill account to get a deposit for.
   *    @param {string} depositId(required) The deposit to get.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   * }
   */
  async getDeposit(params = {}) {
    logger.info("BillingManager getDeposit");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.depositId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Deposit failed due to: One of required accountId, accountCode, depositId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      params.accountId = [params.accountId];
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getDepositList",
        errorMessage: "Get Deposit failed.",
        throwError: true
      });
      const depositElement = $("response").find("deposit");
      const deposit = depositElement.toArray().filter(_deposit => {
        return $(_deposit).attr("number") === params.depositId;
      });
      if (deposit.length === 1) {
        const type = $(deposit)
          .find("deposit_type_code")
          .text();
        const typeDescription = $(deposit)
          .find("deposit_type_description")
          .text();
        const amountElement = $(deposit).find("amount");
        const amount = amountElement.text();
        // const curr_alpha_code = amountElement.attr("curr_alpha_code");
        const currency = amountElement.attr("currency");
        // const precision = amountElement.attr("precision");
        // const symbol = amountElement.attr("symbol");
        const status = $(deposit)
          .find("status")
          .text();
        const date = $(deposit)
          .find("date")
          .text();
        const note = $(deposit)
          .find("note")
          .text();
        const paymentId = $(deposit)
          .find("payment_number")
          .text();
        const refundId = $(deposit)
          .find("refund_number")
          .text();
        const productCode = $(deposit)
          .find("product_code")
          .text();
        return {
          depositId: params.depositId,
          amount,
          currency,
          type,
          typeDescription,
          note,
          date: dateUtils.formatDate(date),
          status: getStatusString(DEPOSIT_STATUSES, status),
          paymentId,
          refundId,
          productCode
        };
      } else {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10024,
              message: ERROR_CODES[10024]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getDeposit took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get a list of deposits based on specific filters.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to get a list of deposits for.
   *    @param {string} accountCode(required)  The code for the MindBill account to get a list of deposits for.
   *    @param {Array} status(optional) The status of deposits to retrieve.
   *    @param {object} filters(optional) The filter object to use. {
   * 				@param {string} paymentId(optional)
   * 				@param {string} refundId(optional)
   *				@param {string} fromDate(optional) The starting date to get the deposits for in format YYYY-MM-DD.
   *				@param {string} toDate(optional) The ending date to get the deposits for in format YYYY-MM-DD.
   *				@param {string} type(optional)
   *        @param {string} productCode(optional)
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   * }
   */
  async getDeposits(params = {}) {
    logger.info("BillingManager getDeposits");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Deposits failed due to: One of required accountId, accountCode and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      if (params.filters) {
        if (params.filters.fromDate) {
          params.filters.fromDate = params.filters.fromDate.replace(/-/g, "");
        }
        if (params.filters.toDate) {
          params.filters.toDate = params.filters.toDate.replace(/-/g, "");
        }
      }
      params.accountId = [params.accountId];
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getDepositList",
        errorMessage: "Get Deposits failed.",
        throwError: true
      });
      const depositElement = $("response").find("deposit");
      const deposits = depositElement.toArray().map(deposit => {
        const depositId = $(deposit).attr("number");
        const type = (
          $(deposit)
            .find("deposit_type_code")
            .text() || ""
        ).toUpperCase();
        const typeDescription = $(deposit)
          .find("deposit_type_description")
          .text();
        const amountElement = $(deposit).find("amount");
        const amount = amountElement.text();
        // const curr_alpha_code = amountElement.attr("curr_alpha_code");
        const currency = amountElement.attr("currency");
        // const precision = amountElement.attr("precision");
        // const symbol = amountElement.attr("symbol");
        const status = $(deposit)
          .find("status")
          .text();
        const date = $(deposit)
          .find("date")
          .text();
        const note = (
          $(deposit)
            .find("note")
            .text() || ""
        ).trim();
        const paymentId = $(deposit)
          .find("payment_number")
          .text();
        const refundId = $(deposit)
          .find("refund_number")
          .text();
        const productCode = $(deposit)
          .find("product_code")
          .text();
        return {
          depositId,
          amount,
          currency,
          type,
          typeDescription,
          note,
          date: dateUtils.formatDate(date),
          status: getStatusString(DEPOSIT_STATUSES, status),
          paymentId,
          refundId,
          productCode
        };
      });
      return {
        deposits
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getDeposits took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Add/Update credit card details on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to add/update a credit card for.
   *    @param {string} accountCode(required)  The account code to add/update a credit card for.
   *    @param {object} creditCard(required)
   *    {
   *        @param {string} cardType(required)  The type of credit card, for example VISA. Allowed Values: VISA,
   *          MASTERCARD, AMEX
   *        @param {string} number(required)  The credit card number.
   *        @param {string} holder(required)  The credit card holder's name.
   *        @param {string} expMonth(required)  The credit card expiry month. Ex: '04'.
   *        @param {string} expYear(required)  The credit card expiry year. Ex: '2017'.
   *        @param {string} CVV(required)  The credit card security code. Ex: '104 or '7612'.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updateCreditCard(params = {}) {
    logger.info("BillingManager updateCreditCard");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.creditCard === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update credit card failed due to: One of required accountId, accountCode, creditCard and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      let cardinfo = null;
      cardinfo = await creditCardManager.addCreditCard({
        businessUnit: params.businessUnit,
        accountId: params.accountId,
        accountCode: params.accountCode,
        creditCard: params.creditCard
      });
      params.automaticPayment = {
        creditCard: cardinfo
      };
      await mindBillService.execute({
        data: params,
        operation: "updateAccount",
        errorMessage: "Update credit card failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager updateCreditCard took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Delete credit card details on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to add/update a credit card for.
   *    @param {string} accountCode(required)  The account code to add/update a credit card for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async deleteCreditCard(params = {}) {
    logger.info("BillingManager deleteCreditCard");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Delete credit card failed due to: One of required accountId, accountCode, and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      params.automaticPayment = {
        creditCard: {
          delete: true
        }
      };
      await mindBillService.execute({
        data: params,
        operation: "updateAccount",
        errorMessage: "Delete credit card failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager deleteCreditCard took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get packages for a particular account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to get the invoice for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   *    }
   * }
   */
  async getPackages(params = {}) {
    logger.info("BillingManager getPackages");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Packages failed due to: One of required accountId and/or businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "getAccountServiceList",
        errorMessage: "Get Packages failed.",
        throwError: true
      });
      let product = $("response").find("product");
      const service_list = product.find("service");
      const services =
        (
          service_list &&
          service_list
            .filter((_index, service) => {
              return (
                ($(
                  $(service)
                    .children()
                    .filter((_index, f) => {
                      return f.name === "status";
                    })[0]
                )
                  .children()
                  .first()
                  .text() || "") === "1"
              ); //Package is active: Use PACKAGE_STATUSES to filter when support is needed
            })
            .map((_index, service) => {
              const code =
                $(
                  $(service)
                    .children()
                    .filter((_index, f) => {
                      return f.name === "code";
                    })[0]
                ).text() || "";
              const key =
                $(
                  $(service)
                    .children()
                    .filter((_index, f) => {
                      return f.name === "key";
                    })[0]
                ).text() || "";
              const type =
                $(
                  $(service)
                    .children()
                    .filter((_index, f) => {
                      return f.name === "type";
                    })[0]
                ).text() || "";
              const description =
                $(
                  $(service)
                    .children()
                    .filter((_index, f) => {
                      return f.name === "description";
                    })[0]
                ).text() || "";
              const id = $(service).attr("id");
              return {
                id,
                code,
                key,
                description,
                type
              };
            })
        ).toArray() || [];
      const packages = [];
      for (let i = 0; i < services.length; i++) {
        const opts = Object.assign({}, params);
        const svc = services[i];
        opts.serviceId = svc.id;
        opts.serviceCode = svc.code;
        const { $ } = await mindBillService.execute({
          data: opts,
          operation: "getAccountService",
          errorMessage: "Get Packages failed.",
          throwError: true
        });
        const service = $("response").find("service");
        /*
name: "status"
name: "creation_date"
name: "activation"
name: "expiration_date"
name: "expiration_policy"
name: "paid_by"
name: "billed_by"
name: "discount"
name: "sf_discount_value"
name: "fub_priority_value"
 name: "tariff_plan"
 name: "advanced"
 name: "ip"
 name: "free_units"
 name: "specific"
 name: "dont_apply_rc_proration"
 name: "rc_start_date"
 name: "mandatory"
 name: "class"
 name: "gui_order"
*/

        const recurringCharge =
          parseFloat(
            service
              .find("tariff_plan")
              .find("age")
              .attr("recurring_charge")
          ) || null;
        const installment = service.find("expiration_policy").find("relative");
        const remainingInstallments =
          parseInt(installment && installment.find("aging").text()) || null;

        const pkg = {
          code: svc.code,
          packageId: svc.id,
          key: svc.key,
          description: svc.description,
          type: svc.type
        };
        if (svc.type === "INSTLLMNT") {
          pkg.remainingInstallments = remainingInstallments;
          pkg.recurringCharge = recurringCharge;
        }
        packages.push(pkg);
      }
      return {
        packages
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager getPackages took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Delete a package from an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to delete a package for.
   *    @param {string} accountCode(required)  The code for the MindBill account to delete a package for.
   *    @param {string} packageId(required) The package to delete.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   * }
   */
  async deletePackage(params = {}) {
    logger.info("BillingManager deletePackage");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.packageId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Delete Package failed due to: One of required accountId, accountCode, packageId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const options = Object.assign({}, params);
      options.serviceId = params.packageId;
      options.operations = {
        deactivate: {}
      };
      await mindBillService.execute({
        data: options,
        operation: "updateAccountService",
        errorMessage: "Delete Package failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager deletePackage took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Add a package to an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to add a package for.
   *    @param {string} accountCode(required)  The code for the MindBill account to add a package for.
   *    @param {object} package(required) The package to add.
   *    {
   *        @param {string} code(required)
   *        @param {object} config(optional)
   *        {
   *        }
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   * }
   */
  async addPackage(params = {}) {
    logger.info("BillingManager addPackage");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.package === "undefined" ||
      typeof params.package.code === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Add Package failed due to: One of required accountId, accountCode, package, package.code and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      const options = Object.assign({}, params);
      options.service = params.package;
      delete options.package;
      const { $ } = await mindBillService.execute({
        data: options,
        operation: "addAccountService",
        errorMessage: "Add Package failed.",
        throwError: true
      });
      let packageId = $("response")
        .find("service")
        .attr("id");
      return { packageId };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BillingManager addPackage took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
