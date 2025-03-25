"use strict";
const async = require("async");
const express = require("express");
const logger = require("./../../logger")(module);
const router = express.Router();
const cityTimezones = require("./../../utils/timezones");
const { validationError, genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const { LANGUAGES } = require("./../../utils/constants");
const getAccountMiddleware = require("./../../utils/middleware/get-account-middleware");
const validators = require("./../../utils/validators/account-route-validators");
const {
  accountManager,
  broadSoftManager,
  planManager,
  portingManager,
  telephoneNumberManager
} = require("./../../managers");
const dateUtils = require("./../../utils/dates");

/**
 * POST create account
 *
 * Request body object
 * @param {object} contact(required)
 * {
 *    @param {string} fname(required)  The first name of the account holder.
 *    @param {string} lname(required)  The last name of the account holder.
 *    @param {string} address1(required)  The primary mailing addresss of the account holder's billing address.
 *    @param {string} address2(optional)
 *    @param {string} address3(optional)
 *    @param {string} city(required)  The city of the account holder's billing address.
 *    @param {string} province(required)  The province of the account holder's billing address.
 *        Accepts 2-character abbreviated code, for example ON (Ontario).
 *    @param {string} country(required)  The country of the account holder's billing address.
 *        Accepts 2-character abbreviated code, for example US (United States)
 *    @param {string} postalCode(required)  The postal code of the account holder's billing address.
 *    @param {string} emailAddress(required)  The primary email address of the account holder.
 *    @param {object} phone(optional)
 *    {
 *       @param {string} home(optional) The home phone number to contact the account holder.
 *       @param {string} business(optional) The business phone number to contact the account holder.
 *       @param {string} mobile(optional) The mobile phone number to contact the account holder.
 *    }
 * }
 * @param {string} name(optional)  The name of the account. Will default to 'contact.fname contact.lname'.
 * @param {string} language(optional)  Correspondence language for this account. Default is "EN"
 */
router.post("/", async (req, res, next) => {
  logger.info("POST:  create account");
  req.checkBody(validators.post.account);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    const body = Object.assign({}, req.body);
    body.businessUnit = req._businessUnit;
    try {
      const account = await accountManager.createMasterAccount(body);
      delete account.service;
      delete account.contract;
      return res.json(account);
    } catch (e) {
      return next(e);
    }
  }
});

/**
 * PATCH update account
 *
 * Request body object
 * @param {string} status(optional)  The service status associated with this account.
 * @param {string} name(optional)  The account name associated with this account.
 * @param {string} language(optional)  Correspondence language for this account. Default is "en"
 * @param {object} contact(optional)
 * {
 *    @param {string} fname(optional)  The first name of the account holder.
 *    @param {string} lname(optional)  The last name of the account holder.
 *    @param {string} address1(optional)  The primary mailing addresss of the account holder's billing address.
 *    @param {string} address2(optional)
 *    @param {string} address3(optional)
 *    @param {string} city(optional)  The city of the account holder's billing address.
 *    @param {string} province(optional)  The province of the account holder's billing address.
 *        Accepts 2-character abbreviated code, for example ON (Ontario).
 *    @param {string} country(optional)  The country of the account holder's billing address.
 *        Accepts 2-character abbreviated code, for example US (United States)
 *    @param {string} postalCode(optional)  The postal code of the account holder's billing address.
 *    @param {string} emailAddress(optional)  The primary email address of the account holder.
 *    @param {object} phone(optional)
 *    {
 *       @param {string} home(optional) The home phone number to contact the account holder.
 *       @param {string} business(optional) The business phone number to contact the account holder.
 *       @param {string} mobile(optional) The mobile phone number to contact the account holder.
 *    }
 * }
 */
router.patch("/:accountId", getAccountMiddleware, async (req, res, next) => {
  const accountId = req.params.accountId;
  logger.info(`PATCH:  update account #${accountId}`);
  req.checkBody(validators.patch.account);
  const body = Object.assign({}, req.body);
  body.contact = body.contact || {};
  if (
    req.body.status &&
    req.body.status.toUpperCase() === (req.account.status || "").toUpperCase()
  ) {
    req._validationErrors.push({
      param: "status",
      msg: "1007",
      location: "body",
      value: req.body.status
    });
  }
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    body.contact.contactId = req.account.primaryContactId;
    const oldContactInfo = req.account.contact;
    const params = Object.assign(body, {
      accountId: req.account.ID,
      businessUnit: req._businessUnit
    });
    try {
      const account = await accountManager.updateAccount(params);

      delete account.contact.contactId;
      delete account.provisioning;
      delete account.billing;
      delete account.automaticPayment;
      delete account.service;
      delete account.mindCode;
      delete account.contract;
      account.language = (
        params.language || req.account.language
      ).toUpperCase();
      return res.json(account);
    } catch (e) {
      return next(e);
    }
  }
});

/**
 * GET accounts (for authenticated provider/business unit)
 *
 * Request query strings
 * @param {string} query(optional) Search string.
 * @param {string} status(optional) Comma-delimited Status strings.
 * @param {number} page(optional) Defaults to 1.
 * @param {number} pageLimit(optional) Defaults to 10.
 */
router.get("/", async (req, res, next) => {
  logger.info(`GET:  get accounts`);
  req.checkQuery(validators.get.accounts);
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
            ["NEW", "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(
              status.toUpperCase()
            ) < 0
          );
        });
        if (notFound) {
          req._validationErrors.push({
            param: "status",
            msg: "1038",
            location: "query",
            value: req.query.status
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
      const data = await accountManager.getAccounts({
        businessUnit: req._businessUnit,
        query: decodeURIComponent((req.query.query || "").toLowerCase()),
        status: statuses,
        page: parseInt(req.query.page),
        pageLimit: parseInt(req.query.pageLimit)
      });
      return res.json(data);
    } catch (e) {
      return next(e);
    }
  }
});

/**
 * GET all service accounts based on search critieria
 *
 * Request query strings
 * @param {string} query(optional) Search string.
 * @param {string} sim(optional) Search string.
 * @param {string} telephoneNumber(optional) Search string.
 * @param {string} status(optional) Comma-delimited Status strings.
 * @param {number} page(optional) Defaults to 1.
 * @param {number} pageLimit(optional) Defaults to 10.
 */
router.get("/services", async (req, res, next) => {
  logger.info(`GET:  all service accounts based on search critieria`);
  req.checkQuery(validators.get.accounts);
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
            ["NEW", "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(
              status && status.toUpperCase()
            ) < 0
          );
        });
        if (notFound) {
          req._validationErrors.push({
            param: "status",
            msg: "1038",
            location: "query",
            value: req.query.status
          });
        }
      }
      if (
        !req.query.query &&
        !req.query.status &&
        !req.query.sim &&
        !req.query.telephoneNumber
      ) {
        // req._validationErrors.push({
        //   param: "query/status",
        //   msg: "1066",
        //   location: "query",
        //   value: req.query.query + " " + req.query.status
        // });
      }
      result = await req.getValidationResult();
      if (!result.isEmpty()) {
        return next(
          validationError({
            errors: result.array()
          })
        );
      }
      const data = await accountManager.getServiceAccounts({
        businessUnit: req._businessUnit,
        query: decodeURIComponent((req.query.query || "").toLowerCase()),
        // sim: decodeURIComponent(req.query.sim || ""),
        // telephoneNumber: decodeURIComponent(req.query.telephoneNumber || ""),
        status: statuses,
        page: parseInt(req.query.page),
        pageLimit: parseInt(req.query.pageLimit)
      });
      return res.json(data);
    } catch (e) {
      return next(e);
    }
  }
});

/**
 * GET account info
 *
 * Request param strings
 * @param {string} accountId(required)  The account id to retrieve info for.
 */
router.get("/:accountId", getAccountMiddleware, async (req, res, next) => {
  const accountId = req.params.accountId;
  logger.info(`GET:  get account info for account #${accountId}`);
  try {
    const account = await accountManager.getAccount({
      accountId: req.account.ID,
      businessUnit: req._businessUnit
    });
    delete account.agent;
    delete account.udf;
    delete account.contact.contactId;
    delete account.billing;
    delete account.provisioning;
    delete account.service;
    delete account.mindCode;
    delete account.contract;
    account.language = req.account.language.toUpperCase();
    const { services } = await accountManager.getServiceAccounts({
      accountId: req.account.ID,
      businessUnit: req._businessUnit,
      pageLimit: "all"
    });
    const portingRequests = await portingManager.getPortRequests({
      accountId,
      businessUnit: req._businessUnit
    });
    // if (portingRequests.requests.length) {
    for (let i = 0; i < services.length; i++) {
      services[i].porting = [];
      for (let j = 0; j < portingRequests.requests.length; j++) {
        if (portingRequests.requests[j].serviceId === services[i].serviceId) {
          services[i].porting.push(portingRequests.requests[j]);
        }
      }
    }
    // }
    account.services = services;
    return res.json(account);
  } catch (e) {
    return next(e);
  }
});

/**
 * POST create a new service account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to create a new service account on.
 *
 * Request body object
 * {
 *    @param {boolean} isLegacy(optional)  if this account should be treated as legacy.
 *    @param {object} agent(optional)  The agent associated with the creation of this account.
 *    {
 *        @param {string} agentId(required)
 *        @param {string} commissionCode(required)
 *    }
 *    @param {object} billing(optional)
 *    {
 *        @param {boolean} billParentAccount(optional)
 *        @param {number} recurringCharge(optional) The monthly charge associated with this service
 *          (this is what the customer will actually be billed).
 *    }
 *    @param {object} contact(required)
 *    {
 *        @param {string} fname(required)  The first name of the account holder.
 *        @param {string} lname(required)  The last name of the account holder.
 *        @param {string} address1(required)  The primary mailing addresss of the account holder's billing address.
 *        @param {string} address2(optional)
 *        @param {string} address3(optional)
 *        @param {string} city(required)  The city of the account holder's billing address.
 *        @param {string} province(required)  The province of the account holder's billing address.
 *          Accepts 2-character abbreviated code, for example ON (Ontario).
 *        @param {string} country(required)  The country of the account holder's billing address.
 *          Accepts 2-character abbreviated code, for example US (United States)
 *        @param {string} postalCode(required)  The postal code of the account holder's billing address.
 *        @param {string} emailAddress(required)  The primary email address of the account holder.
 *    }
 *    @param {string} planCode(required)  The code representing the plan or subscription associated with this
 *        account. For a list of available plans see /plans.
 *    @param {string} name(optional)  A name for this service account.
 *    @param {object} contract(optional)
 *    {
 *        @param {integer} length(required) in months
 *        @param {string} startDate(optional) In format YYYY-MM-DD
 *    }
 * }
 */
router.post(
  "/:accountId/services",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const businessUnit = req._businessUnit;
    logger.info(`POST:  add a new service for account: ${accountId}`);
    req.checkBody(validators.post.service);
    try {
      let result = await req.getValidationResult();
      if (!result.isEmpty()) {
        return next(
          validationError({
            errors: result.array()
          })
        );
      }
      const plan = await planManager.getPlanDetails({
        planCode: req.body.planCode,
        businessUnit
      });
      if (
        req.body.agent &&
        (!req.body.agent.agentId || !req.body.agent.commissionCode)
      ) {
        req._validationErrors.push({
          param: "agent",
          msg: "1051",
          location: "body",
          value: req.body.agent
        });
      }
      // if (req.body.contract && typeof req.body.contract.length === "undefined") {
      //   req._validationErrors.push({
      //     param: "contract",
      //     msg: "1054",
      //     location: "body",
      //     value: req.body.contract
      //   });
      // }
      if (!plan || Object.keys(plan).length === 0) {
        req._validationErrors.push({
          param: "planCode",
          msg: "1039",
          location: "body",
          value: req.body.planCode
        });
      }
      result = await req.getValidationResult();
      if (!result.isEmpty()) {
        return next(
          validationError({
            errors: result.array()
          })
        );
      }
      const product = {
        planCode: req.body.planCode,
        type: plan.billingType
      };
      //TODO:  make sure for now that they can't add phone
      delete req.body.contact.phone;
      const params = {
        isLegacy: req.body.isLegacy,
        contact: req.body.contact,
        accountId,
        agent: req.body.agent,
        parentId: req.account.ID,
        businessUnit: businessUnit,
        billing: Object.assign(
          businessUnit.config.mind.serviceAccount[product.type].billing,
          {
            billable:
              plan.billable === 1
                ? true
                : req.body.billing &&
                  typeof req.body.billing.billParentAccount !== "undefined"
                ? !req.body.billing.billParentAccount
                : false
          },
          {
            recurringCharge:
              req.body.billing &&
              typeof req.body.billing.recurringCharge !== "undefined"
                ? req.body.billing.recurringCharge
                : null
          }
        ),
        product,
        billingType: product.type,
        name: req.body.name
      };
      // if(req.body.contract) {
      //   req.body.contract.length = parseInt(req.body.contract.length);
      //   params.contract = Object.assign({}, req.body.contract);
      //   params.contract.startDate = params.contract.startDate ? params.contract.startDate.replace(/-/g,"") : dateUtils.yyyymmdd();
      // }
      const timezones = cityTimezones.lookupViaCity(params.contact.city);
      const _found = timezones.find(timezone => {
        return (
          timezone.state_ansi.toUpperCase() ===
          params.contact.province.toUpperCase()
        );
      });
      params.contact.timezone =
        (_found && _found.timezone) || "America/New_York";
      params.language = req.account.language || "EN";
      const account = await accountManager.createServiceAccount(params);
      const data = Object.assign(
        {},
        req.body,
        {
          billing: {
            recurringCharge:
              typeof account.recurringCharge !== "undefined" &&
              account.recurringCharge !== null &&
              account.recurringCharge >= 0
                ? account.recurringCharge
                : plan.recurringCharge,
            billParentAccount:
              plan.billable === 1
                ? false
                : req.body.billing &&
                  typeof req.body.billing.billParentAccount !== "undefined"
                ? req.body.billing.billParentAccount
                : true
          }
        },
        {
          provisioning: {}
        },
        account
      );
      delete data.recurringCharge;
      delete data.planCode;
      data.language = LANGUAGES[req.account.language];
      data.provisioning.planCode = req.body.planCode;
      data.provisioning.telephoneNumber = null;
      data.provisioning.SIM = null;
      data.provisioning.IMEI = null;
      data.language = req.account.language;
      data.agent = data.agent || {};
      data.agent.agentId = data.agent.agentId || null;
      data.agent.commissionCode = data.agent.commissionCode || null;
      delete data.mindCode;
      delete data.isLegacy;
      return res.json(data);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
);

/**
 * GET all service accounts on master account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to get all service account details for.
 *
 * Request query strings
 * @param {string} query(optional) Search string.
 * @param {string} status(optional) Comma-delimited Status strings.
 * @param {string} sim(optional) Search string.
 * @param {string} telephoneNumber(optional) Search string.
 * @param {number} page(optional) Defaults to 1.
 * @param {number} pageLimit(optional) Defaults to 10.
 */
router.get(
  "/:accountId/services",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    logger.info(`GET:  get all services for account: ${accountId}`);
    req.checkQuery(validators.get.accounts);
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
              ["NEW", "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(
                status && status.toUpperCase()
              ) < 0
            );
          });
          if (notFound) {
            req._validationErrors.push({
              param: "status",
              msg: "1038",
              location: "query",
              value: req.query.status
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
        const data = await accountManager.getServiceAccounts({
          accountId: req.account.ID,
          businessUnit: req._businessUnit,
          query: decodeURIComponent((req.query.query || "").toLowerCase()),
          status: statuses,
          // sim: decodeURIComponent(req.query.sim || ""),
          // telephoneNumber: decodeURIComponent(req.query.telephoneNumber || ""),
          page: parseInt(req.query.page),
          pageLimit: parseInt(req.query.pageLimit)
        });
        return res.json(data);
      } catch (e) {
        return next(e);
      }
    }
  }
);
/**
 * GET specified service account on master account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to get service account details for.
 * @param {string} serviceId(required)  The service account id to retrieve.
 */
router.get(
  "/:accountId/services/:serviceId",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    logger.info(`GET:  get service: ${serviceId} for account: ${accountId}`);
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    try {
      const data = await accountManager.getAccount({
        accountId: service.ID,
        businessUnit: req._businessUnit,
        flatRateTariff: service.flatRateTariff
      });

      if (data.contact) {
        delete data.contact.contactId;
        //TODO:  no need for this now
        delete data.contact.phone;
      }
      data.legacy = service.legacy;
      delete data.service;
      delete data.mindCode;
      data.provisioning = data.provisioning || {};
      data.provisioning.planCode =
        service.planCode || data.provisioning.planCode || null;
      data.provisioning.telephoneNumber =
        service.telephoneNumber || data.provisioning.telephoneNumber || null;
      data.provisioning.SIM = service.sim || data.provisioning.SIM || null;
      data.provisioning.IMEI = service.imei || null;

      const portingRequests = await portingManager.getPortRequests({
        serviceId,
        businessUnit: req._businessUnit
      });
      data.porting = portingRequests.requests;
      data.callForwarding = {};
      data.voicemail = {};

      let broadsoftPlan = service.broadsoft;
      let broadSoftResponse = null;
      let operations = [];
      if (broadsoftPlan && broadsoftPlan.callForwarding) {
        operations = broadsoftPlan.callForwarding.info;
      }

      if (operations.length) {
        broadSoftResponse = await broadSoftManager.execute({
          account: {
            serviceId
          },
          operations,
          businessUnit: req._businessUnit
        });
        if (
          broadSoftResponse &&
          broadSoftResponse.errors &&
          broadSoftResponse.errors.length
        ) {
          logger.error(
            `Error GET Call Forwarding details for account ${serviceId}: ${broadSoftResponse.errors.reduce(
              (acc, error) => {
                return error;
              },
              ""
            )}`
          );
          // return next(
          //   genericError({
          //     status: 500,
          //     code: 500,
          //     type: "BroadSoftError",
          //     errors: broadSoftResponse.errors.map(error => {
          //       return {
          //         message: error
          //       };
          //     })
          //   })
          // );
        } else {
          const callForwardingGroups = {
            UserCallForwardingAlwaysGetResponse: "always",
            UserCallForwardingBusyGetResponse: "busy",
            UserCallForwardingNotReachableGetResponse: "notReachable",
            UserCallForwardingNoAnswerGetResponse13mp16: "noAnswer"
          };

          data.callForwarding.always = {};
          data.callForwarding.busy = {};
          data.callForwarding.notReachable = {};
          data.callForwarding.noAnswer = {};
          ((broadSoftResponse && broadSoftResponse.response) || []).map(
            elem => {
              // command is elem.attribs["xsi:type"]
              const group = callForwardingGroups[elem.attribs["xsi:type"]];
              Array.from(elem.children || []).forEach(child => {
                let value = child.children[0].data;
                if (
                  (value || "").toLowerCase() === "true" ||
                  (value || "").toLowerCase() === "false"
                ) {
                  value = eval(value.toLowerCase());
                }
                if (child.name.toLowerCase() === "isactive") {
                  child.name = "enabled";
                }
                if (child.name.toLowerCase() === "forwardtophonenumber") {
                  child.name = "forwardToNumber";
                }
                if (child.name.toLowerCase() !== "isringsplashactive") {
                  data.callForwarding[group][child.name] = value;
                }
              });
            }
          );
        }
      }

      operations = [];
      if (broadsoftPlan && broadsoftPlan.voicemail) {
        operations = broadsoftPlan.voicemail.info;
      }
      if (operations.length) {
        broadSoftResponse = await broadSoftManager.execute({
          account: {
            serviceId
          },
          operations,
          businessUnit: req._businessUnit
        });
        if (
          broadSoftResponse &&
          broadSoftResponse.errors &&
          broadSoftResponse.errors.length
        ) {
          logger.error(
            `Error GET Voicemail details for account ${serviceId}: ${broadSoftResponse.errors.reduce(
              (acc, error) => {
                return error;
              },
              ""
            )}`
          );
          // return next(
          //   genericError({
          //     status: 500,
          //     code: 500,
          //     type: "BroadSoftError",
          //     errors: broadSoftResponse.errors.map(error => {
          //       return {
          //         message: error
          //       };
          //     })
          //   })
          // );
        } else {
          const voicemailGroups = {
            UserVoiceMessagingUserGetVoiceManagementResponse17:
              "voicemailToEmail",
            UserVoiceMessagingUserGetVoicePortalResponse16: "autoLogin"
          };
          data.voicemail.voicemailToEmail = {};
          data.voicemail.autoLogin = {};
          ((broadSoftResponse && broadSoftResponse.response) || []).map(
            elem => {
              // command is elem.attribs["xsi:type"]
              const group = voicemailGroups[elem.attribs["xsi:type"]];
              Array.from(elem.children || []).forEach(child => {
                let value = child.children[0].data;
                let addToReturn = false;
                if (
                  (value || "").toLowerCase() === "true" ||
                  (value || "").toLowerCase() === "false"
                ) {
                  value = eval(value.toLowerCase());
                }
                if (child.name.toLowerCase() === "isactive") {
                  child.name = "enabled";
                  addToReturn = true;
                }
                if (
                  child.name.toLowerCase() ===
                  "voicemessagecarboncopyemailaddress"
                ) {
                  child.name = "emailAddress";
                  addToReturn = true;
                }
                if (child.name.toLowerCase() === "voiceportalautologin") {
                  child.name = "enabled";
                  addToReturn = true;
                }

                if (addToReturn) {
                  data.voicemail[group][child.name] = value;
                }
              });
            }
          );
        }
        //TODO:  parse broadsoft response
      }
      return res.json(data);
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * DELETE a service account on specified master account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id of the service account to delete.
 * @param {string} serviceId(required)  The service account id to delete.
 */
router.delete(
  "/:accountId/services/:serviceId",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    const businessUnit = req._businessUnit;
    logger.info(
      `DELETE:  delete service: ${serviceId} for account: ${accountId}`
    );
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          message: "Delete Service Account failed.",
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    try {
      let account = await accountManager.deleteServiceAccount({
        service,
        businessUnit
      });

      return res.json({});
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
);

/**
 * PATCH add/update a service account on master account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to add/update.
 *
 * Request body object
 *    @param {string} status(optional)  The service status associated with this account.
 *    @param {object} billing(optional)
 *    {
 *        @param {boolean} billParentAccount(optional)
 *        @param {number} recurringCharge(optional) The monthly charge associated with this service
 *          (this is what the customer will actually be billed).
 *    }
 *    @param {object} contact(optional)
 *    {
 *        @param {string} fname(optional)  The first name of the account holder.
 *        @param {string} lname(optional)  The last name of the account holder.
 *        @param {string} address1(optional)  The primary mailing addresss of the account holder's billing address.
 *        @param {string} address2(optional)
 *        @param {string} address3(optional)
 *        @param {string} city(optional)  The city of the account holder's billing address.
 *        @param {string} province(optional)  The province of the account holder's billing address.
 *          Accepts 2-character abbreviated code, for example ON (Ontario).
 *        @param {string} country(optional)  The country of the account holder's billing address.
 *          Accepts 2-character abbreviated code, for example US (United States)
 *        @param {string} postalCode(optional)  The postal code of the account holder's billing address.
 *        @param {string} emailAddress(optional)  The primary email address of the account holder.
 *    }
 *    @param {string} name(optional)  A name for this service account.
 *    @param {object} contract(optional)
 *    {
 *        @param {integer} length(required) in months
 *        @param {string} startDate(optional) In format YYYY-MM-DD
 *    }
 */
router.patch(
  "/:accountId/services/:serviceId",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    const businessUnit = req._businessUnit;
    logger.info(
      `PATCH:  update info on service: ${serviceId} for account: ${accountId}`
    );
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    req.checkBody(validators.patch.service);
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    }
    const tasks = {};
    if (
      ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
        (service.status || "").toUpperCase()
      ) < 0
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10001,
              message: ERROR_CODES[10001]
            }
          ]
        })
      );
    }
    if (
      req.body.status &&
      req.body.status.toUpperCase() === (service.status || "").toUpperCase()
    ) {
      req._validationErrors.push({
        param: "status",
        msg: "1007",
        location: "body",
        value: req.body.status
      });
    }
    if (req.body.contract && typeof req.body.contract.length === "undefined") {
      req._validationErrors.push({
        param: "contract",
        msg: "1054",
        location: "body",
        value: req.body.contract
      });
    }
    // if (req.body.contract && typeof req.body.contract.startDate !== "undefined") {
    //   let now = dateUtils.yyyymmdd();
    //   if(req.body.contract.startDate.replace(/-/g,"") < now) {
    //     req._validationErrors.push({
    //       param: "contract",
    //       msg: "1056",
    //       location: "body",
    //       value: req.body.contract
    //     });
    //   }
    // }
    if (req.account.status.toUpperCase() !== "ACTIVE") {
      if (!!(req.body.billing && req.body.billing.billParentAccount)) {
        req._validationErrors.push({
          param: "billing.billParentAccount",
          msg: "1040",
          location: "body",
          value: req.body.billing.billParentAccount
        });
      }
      if (req.body.status && req.body.status.toUpperCase() === "ACTIVE") {
        req._validationErrors.push({
          param: "status",
          msg: "1041",
          location: "body",
          value: req.body.status
        });
      }
    }
    if (req.body.status && req.body.status.toUpperCase() === "CLOSED") {
      if (service.telephoneNumber) {
        return next(
          genericError({
            status: 403,
            code: 403,
            errors: [
              {
                code: 10002,
                message: ERROR_CODES[10002]
              }
            ]
          })
        );
      }
      if (service.sim) {
        return next(
          genericError({
            status: 403,
            code: 403,
            errors: [
              {
                code: 10003,
                message: ERROR_CODES[10003]
              }
            ]
          })
        );
      }
    }
    if (
      service.billingType !== "postpaid" &&
      req.body.billing &&
      req.body.billing.billParentAccount
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10004,
              message: ERROR_CODES[10004]
            }
          ]
        })
      );
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
        const status =
          (req.body.status && req.body.status.toUpperCase()) || null;
        const product = {
          type: service.billingType,
          planCode: service.planCode,
          flatRateTariff: service.flatRateTariff
        };
        const contact = req.body.contact;
        if (contact) {
          contact.contactId = service.primaryContactId;
          //TODO:  make sure for now that they can't add phone
          delete contact.phone;
        }
        const params = {
          status,
          contact,
          accountId: service.ID,
          parentId: req.account.ID,
          businessUnit: businessUnit,
          // product,
          billingType: service.billingType,
          name: req.body.name
        };
        if (req.body.contract) {
          req.body.contract.length = parseInt(req.body.contract.length);
          params.contract = Object.assign({}, req.body.contract);
          params.contract.startDate = params.contract.startDate
            ? params.contract.startDate.replace(/-/g, "")
            : dateUtils.yyyymmdd();
        }

        if (
          (service.billable === 0 &&
            req.body.billing &&
            typeof req.body.billing.billParentAccount !== "undefined") ||
          (service.billingType === "postpaid" &&
            req.body.billing &&
            typeof req.body.billing.billParentAccount !== "undefined")
        ) {
          params.billing = Object.assign(
            businessUnit.config.mind.serviceAccount[
              (product && product.type) || service.billingType
            ].billing,
            {
              billable: !req.body.billing.billParentAccount
            }
          );
        }
        params.billing = params.billing || {};
        params.billing.recurringCharge =
          req.body.billing &&
          typeof req.body.billing.recurringCharge !== "undefined"
            ? req.body.billing.recurringCharge
            : null;
        let account = null;
        try {
          account = await accountManager.updateAccount(params);
          if (account.contact) {
            delete account.contact.contactId;
          }
          account = Object.assign({}, req.body, account);
          account.billing.recurringCharge =
            account.billing.recurringCharge || service.recurringCharge;
          const timezones =
            account.contact && account.contact.city
              ? cityTimezones.lookupViaCity(account.contact.city)
              : [];
          const _found = timezones.find(timezone => {
            return (
              timezone.state_ansi.toUpperCase() ===
              (
                (account.contact &&
                  account.contact.province &&
                  account.contact.province) ||
                ""
              ).toUpperCase()
            );
          });
          account.contact.timezone =
            (_found && _found.timezone) || "America/New_York";
          account.provisioning.telephoneNumber = service.telephoneNumber;
          account.provisioning.SIM = service.sim;
          account.provisioning.IMEI = service.imei;
          delete account.automaticPayment;

          account.agent = account.agent || {};
          account.agent.agentId = account.agent.agentId || null;
          account.agent.commissionCode = account.agent.commissionCode || null;
          return res.json(account);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
    });
  }
);

/**
 * PATCH add/update the imei for a service account on specified master account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to add/update the imei for.
 *
 * Request body object
 * @param {string} imei(required)  The device IMEI to be associated with this service account. (Needed if IMEI is not BYOD).
 */
router.patch(
  "/:accountId/services/:serviceId/imei",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    logger.info(
      `PATCH:  update imei to service: ${serviceId} for account: ${accountId}`
    );
    const businessUnit = req._businessUnit;
    if (req.body.imei) {
      req.checkBody(validators.patch.imei);
    }
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    if (
      ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
        (service.status || "").toUpperCase()
      ) < 0
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10005,
              message: ERROR_CODES[10005]
            }
          ]
        })
      );
    }
    const result = req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      const body = {};
      body.accountId = serviceId;
      body.imei = req.body.imei;
      body.businessUnit = businessUnit;
      try {
        const data = await accountManager.updateImeiProvisioning(body);
        return res.json({
          serviceId,
          imei: data.imei
        });
      } catch (e) {
        return next(e);
      }
    }
  }
);

/**
 * PATCH add/update the sim for a service account on specified master accoun
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to update add/update the sim for.
 *
 * Request body object
 * @param {string} sim(required)  The SIM Card ICCID to be associated with this service account.
 */
router.patch(
  "/:accountId/services/:serviceId/sim",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    logger.info(
      `PATCH:  update sim to service: ${serviceId} for account: ${accountId}`
    );
    const businessUnit = req._businessUnit;
    if (req.body.sim != null) {
      req.checkBody(validators.patch.sim);
    }
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    // if (!!service.legacy) {
    //   return next(genericError({
    //     status: 403,
    //     code: 403,
    //     errors: [{
    //       code: 10035,
    //       message: ERROR_CODES[10035]
    //     }]
    //   }));
    // }
    //TODO: we allow changes for CLOSED
    if (
      ["NEW", "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(
        (service.status || "").toUpperCase()
      ) < 0
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10006,
              message: ERROR_CODES[10006]
            }
          ]
        })
      );
    }
    if (service.sim === null && req.body.sim === null) {
      return res.json({
        serviceId,
        sim: req.body.sim
      });
    }
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      const body = {};
      body.serviceId = service.ID;
      body.serviceCode = service.code;
      body.billingType = service.billingType;
      body.accountId = accountId;
      body.oldModel = service.simModel;
      body.oldType = service.simType;
      body.oldSim = service.sim;
      body.newSim = req.body.sim;
      body.businessUnit = businessUnit;
      try {
        const data = await accountManager.updateSimProvisioning(body);
        return res.json({
          serviceId,
          sim: data.sim
        });
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  }
);

/**
 * PATCH add/update the telephoneNumber for a service account on specified master account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to add/update the msisdn for.
 *
 * Request body object
 * @param {string} telephoneNumber(required)  For wireless services, the primary telephone number associated with the service acccount is referred to as an MSISDN.
 */
router.patch(
  "/:accountId/services/:serviceId/telephone-number",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    logger.info(
      `PATCH:  update telephoneNumber to service: ${serviceId} for account: ${accountId}`
    );
    if (
      typeof req.body.telephoneNumber !== "undefined" &&
      req.body.telephoneNumber !== null
    ) {
      if (process.env.NODE_ENV !== "production") {
        req.checkBody(validators.patch.telephoneNumberDev);
      } else {
        req.checkBody(validators.patch.telephoneNumber);
      }
    }
    const businessUnit = req._businessUnit;
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    //TODO: we allow changes for CLOSED
    if (
      ["NEW", "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(
        (service.status || "").toUpperCase()
      ) < 0
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10007,
              message: ERROR_CODES[10007]
            }
          ]
        })
      );
    }

    // if (!!service.legacy) {
    //   return next(genericError({
    //     status: 403,
    //     code: 403,
    //     errors: [{
    //       code: 10033,
    //       message: ERROR_CODES[10033]
    //     }]
    //   }));
    // }
    if (service.telephoneNumber === null && req.body.telephoneNumber === null) {
      return res.json({
        serviceId,
        telephoneNumber: req.body.telephoneNumber
      });
    }
    // if ((service.telephoneNumberModel || "").toUpperCase() !== "MSISDNEXT2" && req.body.telephoneNumber === null) {
    //   return next(genericError({
    //     status: 403,
    //     code: 403,
    //     errors: [{
    //       code: 10036,
    //       message: ERROR_CODES[10036]
    //     }]
    //   }));
    // }
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        if (req.body.telephoneNumber) {
          const reservedNumber = await telephoneNumberManager.getReservedNumbers(
            {
              inUse: false,
              checkLastUsed: true,
              fullNumber: req.body.telephoneNumber,
              businessUnitId: businessUnit.businessUnitId
            }
          );
          if (!reservedNumber.numbers.length) {
            return next(
              genericError({
                status: 403,
                code: 403,
                errors: [
                  {
                    code: 10008,
                    message: ERROR_CODES[10008]
                  }
                ]
              })
            );
          }
        }
        const data = await accountManager.updateTelephoneNumber({
          serviceId: service.ID,
          serviceCode: service.code,
          billingType: service.billingType,
          accountId,
          oldTelephoneNumber: service.telephoneNumber,
          oldModel: service.telephoneNumberModel,
          oldType: service.telephoneNumberType,
          newTelephoneNumber: req.body.telephoneNumber,
          businessUnit
        });

        return res.json(
          Object.assign({}, data, {
            serviceId
          })
        );
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  }
);

/**
 * PATCH add/update a plan on a service account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to add/update.
 *
 * Request body object
 * @param {string} planCode(required)  The code representing the plan or subscription associated with this
 *       account. For a list of available plans see /plans.
 */
router.patch(
  "/:accountId/services/:serviceId/plan",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    const businessUnit = req._businessUnit;
    logger.info(
      `PATCH:  update plan to service: ${serviceId} for account: ${accountId}`
    );
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }

    req.checkBody(validators.patch.plan);
    if (req.body.planCode === null) {
      return next(
        validationError({
          status: 400,
          code: 400,
          errors: [
            {
              code: 1021,
              message: ERROR_CODES[1021]
            }
          ]
        })
      );
    }
    if ((service.status || "").toUpperCase() !== "ACTIVE") {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10009,
              message: ERROR_CODES[10009]
            }
          ]
        })
      );
    }
    if (req.body.planCode.toUpperCase() === service.planCode.toUpperCase()) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10010,
              message: ERROR_CODES[10010]
            }
          ]
        })
      );
    }
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    }
    const tasks = {};
    tasks.plan = callback => {
      planManager
        .getPlanDetails({
          planCode: req.body.planCode,
          businessUnit
        })
        .then(plan => {
          if (!plan || Object.keys(plan).length === 0) {
            req._validationErrors.push({
              location: "body",
              value: req.body.planCode,
              param: "planCode",
              msg: "1042"
            });
          } else {
            if (plan.billingType !== service.billingType) {
              req._validationErrors.push({
                location: "body",
                value: req.body.planCode,
                param: "planCode",
                msg: "1043"
              });
            }
          }
          callback(null, plan);
        })
        .catch(callback);
    };
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
        const product = {
          type: results.plan.billingType,
          planCode: results.plan.planCode,
          flatRateTariff: results.plan.flatRateTariff
        };
        const params = {
          accountId: service.ID,
          parentId: req.account.ID,
          businessUnit: businessUnit,
          product,
          billingType: product.type
        };
        let account = null;
        try {
          account = await accountManager.updateAccount(params);
          if (account.contact) {
            delete account.contact.contactId;
          }
          account = Object.assign({}, req.body, account);
          account.provisioning.telephoneNumber = service.telephoneNumber;
          account.provisioning.SIM = service.sim;
          account.provisioning.IMEI = service.imei;
          account.billing.recurringCharge =
            account.billing.recurringCharge || results.plan.recurringCharge;
          delete account.automaticPayment;
          delete account.planCode;

          account.agent = account.agent || {};
          account.agent.agentId = account.agent.agentId || null;
          account.agent.commissionCode = account.agent.commissionCode || null;
          return res.json(account);
        } catch (e) {
          logger.error(e);
          return next(e);
        }
      }
    });
  }
);

/**
 * GET account service usage
 *
 * Request param strings
 * @param {string} accountId(required)  The account id of the service to retrieve the payments for.
 * @param {string} serviceId(required)  The service id to retrieve the usage for.
 *
 * Request query strings
 * @param {string} type(required)  The type of service to get the usage for.
 * @param {string} invoiceId(optional)  The invoice number to get the usage for.
 * @param {string} date(optional)  The starting date to get the usage for in format YYYY-MM.
 * @param {string} fromDate(optional)  The starting date to get the usage for in format YYYY-MM-DD.
 * @param {string} toDate(optional)  The ending date to get the usage for in format YYYY-MM-DD.
 */
router.get(
  "/:accountId/services/:serviceId/usage",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    const businessUnit = req._businessUnit;
    logger.info(`GET:  get usage for service #${serviceId}`);
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    req.checkQuery(validators.get.usage);
    if (service.billingType !== "postpaid" && req.query.invoiceId) {
      req._validationErrors.push({
        param: "invoiceId",
        msg: "2078",
        location: "query",
        value: req.query.invoiceId
      });
    }
    let result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    } else {
      try {
        let toDate = null;
        let fromDate = null;
        if (req.query.date) {
          let date = req.query.date.split("-").map(i => parseInt(i));
          date = new Date(Date.UTC(date[0], date[1] - 1, 1));
          const y = date.getUTCFullYear();
          const m = date.getUTCMonth();
          fromDate = new Date(y, m, 1).toISOString().split("T")[0];
          toDate = new Date(y, m + 1, 0).toISOString().split("T")[0];
        }

        // if (req.query.fromDate && dateUtils.isValidDate(req.query.fromDate)) {
        //   fromDate = req.query.fromDate;
        // }
        // if (req.query.toDate && dateUtils.isValidDate(req.query.toDate)) {
        //   toDate = req.query.toDate;
        // }
        // if ((fromDate && !toDate) || (!fromDate && toDate)) {
        //   req._validationErrors.push({
        //     param: "fromDate/toDate",
        //     msg: "2072",
        //     location: "query",
        //     value: "From: " + fromDate + " To: " + toDate
        //   });
        // }
        // if (fromDate && toDate) {
        //   if (fromDate >= toDate) {
        //     req._validationErrors.push({
        //       param: "fromDate/toDate",
        //       msg: "2060",
        //       location: "query",
        //       value: "From: " + fromDate + " To: " + toDate
        //     });
        //   }
        // }
        result = await req.getValidationResult();
        if (!result.isEmpty()) {
          return next(
            validationError({
              errors: result.array()
            })
          );
        }
        const usage = await accountManager.getUsage({
          accountId,
          service,
          type: req.query.type.toUpperCase(),
          filters: {
            invoiceId: req.query.invoiceId || null,
            newUsage: !req.query.invoiceId && !req.query.date,
            fromDate,
            toDate
          },
          businessUnit
        });
        return res.json(usage);
      } catch (e) {
        return next(e);
      }
    }
  }
);

/**
 * PATCH add/update voicemail settings on a service account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to update voicemail settings for.
 *
 * Request body object
 *    @param {number} newPin(optional)  New PIN to access voicemail.
 *    @param {object} voicemailToEmail(optional)
 *    {
 *        @param {boolean} enabled(required)
 *        @param {string} emailAddress(required) The email address to send voicemail audio to.
 *    }
 *    @param {object} autoLogin(optional)
 *    {
 *        @param {boolean} enabled(required)
 *    }
 */
router.patch(
  "/:accountId/services/:serviceId/voicemail",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    const businessUnit = req._businessUnit;
    logger.info(
      `PATCH:  update voicemail info on service: ${serviceId} for account: ${accountId}`
    );
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    if (
      service.features === null ||
      (service.features &&
        service.features.length &&
        service.features.indexOf("voicemail") === -1)
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 1061,
              message: ERROR_CODES[1061]
            }
          ]
        })
      );
    }
    if (
      ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
        (service.status || "").toUpperCase()
      ) < 0
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10001,
              message: ERROR_CODES[10001]
            }
          ]
        })
      );
    }
    req.checkBody(validators.patch.voicemail);
    if (
      req.body.voicemailToEmail &&
      req.body.voicemailToEmail.enabled === true &&
      !req.body.voicemailToEmail.emailAddress
    ) {
      req._validationErrors.push({
        param: "voicemailToEmail.emailAddress",
        msg: "1035",
        location: "body",
        value: req.body.voicemailToEmail.emailAddress
      });
    }
    if (
      req.body.voicemailToEmail &&
      typeof req.body.voicemailToEmail.enabled === "undefined"
    ) {
      req._validationErrors.push({
        param: "voicemailToEmail.enabled",
        msg: "1060",
        location: "body",
        value: req.body.voicemailToEmail.enabled
      });
    }
    if (
      req.body.voicemailToEmail &&
      typeof req.body.voicemailToEmail.emailAddress === "undefined"
    ) {
      req._validationErrors.push({
        param: "voicemailToEmail.emailAddress",
        msg: "1035",
        location: "body",
        value: req.body.voicemailToEmail.emailAddress
      });
    }
    if (
      req.body.autoLogin &&
      typeof req.body.autoLogin.enabled === "undefined"
    ) {
      req._validationErrors.push({
        param: "autoLogin.enabled",
        msg: "1060",
        location: "body",
        value: req.body.autoLogin.enabled
      });
    }
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    }
    try {
      let broadsoftPlan = service.broadsoft;
      let broadSoftResponse = null;
      if (broadsoftPlan && broadsoftPlan.voicemail) {
        let operations = [];
        if (typeof req.body.autoLogin !== "undefined") {
          if (
            req.body.autoLogin.enabled &&
            broadsoftPlan.voicemail.autoLogin.enable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.voicemail.autoLogin.enable
            );
          }
          if (
            !req.body.autoLogin.enabled &&
            broadsoftPlan.voicemail.autoLogin.disable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.voicemail.autoLogin.disable
            );
          }
        }
        if (typeof req.body.voicemailToEmail !== "undefined") {
          if (
            req.body.voicemailToEmail.enabled &&
            broadsoftPlan.voicemail.voicemailToEmail.enable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.voicemail.voicemailToEmail.enable
            );
          }
          if (
            !req.body.voicemailToEmail.enabled &&
            broadsoftPlan.voicemail.voicemailToEmail.disable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.voicemail.voicemailToEmail.disable
            );
          }
        }
        if (typeof req.body.newPin !== "undefined") {
          operations = operations.concat(broadsoftPlan.voicemail.newPin.update);
        }
        if (operations.length) {
          broadSoftResponse = await broadSoftManager.execute({
            account: {
              serviceId
            },
            ...req.body,
            operations,
            businessUnit
          });
          if (
            broadSoftResponse &&
            broadSoftResponse.errors &&
            broadSoftResponse.errors.length
          ) {
            return next(
              genericError({
                status: 500,
                code: 500,
                type: "BroadSoftError",
                errors: broadSoftResponse.errors.map(error => {
                  return {
                    message: error
                  };
                })
              })
            );
          }
        }
      }
      return res.json({});
    } catch (e) {
      return next(e);
    }
  }
);

/**
 * PATCH add/update call-forwarding settings on a service account
 *
 * Request param strings
 * @param {string} accountId(required)  The master account id to update service account details for.
 * @param {string} serviceId(required)  The service account id to update call-forwarding settings for.
 *
 * Request body object
 *    @param {object} always(optional)
 *    {
 *        @param {boolean} enabled(required)
 *        @param {number} forwardToNumber(required)
 *    }
 *    @param {object} busy(optional)
 *    {
 *        @param {boolean} enabled(required)
 *        @param {number} forwardToNumber(required)
 *    }
 *    @param {object} notReachable(optional)
 *    {
 *        @param {boolean} enabled(required)
 *        @param {number} forwardToNumber(required)
 *    }
 *    @param {object} noAnswer(optional)
 *    {
 *        @param {boolean} enabled(required)
 *        @param {number} numberOfRings(optional) Default is 8.
 *        @param {number} forwardToNumber(required)
 *    }
 */
router.patch(
  "/:accountId/services/:serviceId/call-forwarding",
  getAccountMiddleware,
  async (req, res, next) => {
    const accountId = req.params.accountId;
    const serviceId = req.params.serviceId;
    const businessUnit = req._businessUnit;
    logger.info(
      `PATCH:  update call-forwarding info on service: ${serviceId} for account: ${accountId}`
    );
    const service = req.account.services[serviceId];
    if (!service) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10000,
              message: ERROR_CODES[10000]
            }
          ]
        })
      );
    }
    if (
      service.features === null ||
      (service.features &&
        service.features.length &&
        service.features.indexOf("callforwarding") === -1)
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 1062,
              message: ERROR_CODES[1062]
            }
          ]
        })
      );
    }
    if (
      ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
        (service.status || "").toUpperCase()
      ) < 0
    ) {
      return next(
        genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10001,
              message: ERROR_CODES[10001]
            }
          ]
        })
      );
    }
    req.checkBody(validators.patch.callForwarding);
    if (
      req.body.always &&
      req.body.always.enabled === true &&
      !req.body.always.forwardToNumber
    ) {
      req._validationErrors.push({
        param: "always.forwardToNumber",
        msg: "1064",
        location: "body",
        value: req.body.always.forwardToNumber
      });
    }
    if (req.body.always && typeof req.body.always.enabled === "undefined") {
      req._validationErrors.push({
        param: "always.enabled",
        msg: "1060",
        location: "body",
        value: req.body.always.enabled
      });
    }
    if (
      req.body.busy &&
      req.body.busy.enabled === true &&
      !req.body.busy.forwardToNumber
    ) {
      req._validationErrors.push({
        param: "busy.forwardToNumber",
        msg: "1064",
        location: "body",
        value: req.body.busy.forwardToNumber
      });
    }
    if (req.body.busy && typeof req.body.busy.enabled === "undefined") {
      req._validationErrors.push({
        param: "busy.enabled",
        msg: "1060",
        location: "body",
        value: req.body.busy.enabled
      });
    }
    if (
      req.body.notReachable &&
      req.body.notReachable.enabled === true &&
      !req.body.notReachable.forwardToNumber
    ) {
      req._validationErrors.push({
        param: "notReachable.forwardToNumber",
        msg: "1064",
        location: "body",
        value: req.body.notReachable.forwardToNumber
      });
    }
    if (
      req.body.notReachable &&
      typeof req.body.notReachable.enabled === "undefined"
    ) {
      req._validationErrors.push({
        param: "notReachable.enabled",
        msg: "1060",
        location: "body",
        value: req.body.notReachable.enabled
      });
    }
    if (
      req.body.noAnswer &&
      req.body.noAnswer.enabled === true &&
      !req.body.noAnswer.forwardToNumber
    ) {
      req._validationErrors.push({
        param: "noAnswer.forwardToNumber",
        msg: "1064",
        location: "body",
        value: req.body.noAnswer.forwardToNumber
      });
    }
    if (req.body.noAnswer && typeof req.body.noAnswer.enabled === "undefined") {
      req._validationErrors.push({
        param: "noAnswer.enabled",
        msg: "1060",
        location: "body",
        value: req.body.noAnswer.enabled
      });
    }
    if (
      req.body.noAnswer &&
      typeof req.body.noAnswer.numberOfRings === "undefined"
    ) {
      req.body.noAnswer.numberOfRings = 8;
    }
    const result = await req.getValidationResult();
    if (!result.isEmpty()) {
      return next(
        validationError({
          errors: result.array()
        })
      );
    }
    try {
      let broadsoftPlan = service.broadsoft;
      let broadSoftResponse = null;
      if (broadsoftPlan && broadsoftPlan.callForwarding) {
        let operations = [];
        if (typeof req.body.always !== "undefined") {
          if (
            req.body.always.enabled &&
            broadsoftPlan.callForwarding.always.enable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.always.enable
            );
          }
          if (
            !req.body.always.enabled &&
            broadsoftPlan.callForwarding.always.disable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.always.disable
            );
          }
        }
        if (typeof req.body.busy !== "undefined") {
          if (
            req.body.busy.enabled &&
            broadsoftPlan.callForwarding.busy.enable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.busy.enable
            );
          }
          if (
            !req.body.busy.enabled &&
            broadsoftPlan.callForwarding.busy.disable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.busy.disable
            );
          }
        }
        if (typeof req.body.notReachable !== "undefined") {
          if (
            req.body.notReachable.enabled &&
            broadsoftPlan.callForwarding.notReachable.enable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.notReachable.enable
            );
          }
          if (
            !req.body.notReachable.enabled &&
            broadsoftPlan.callForwarding.notReachable.disable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.notReachable.disable
            );
          }
        }
        if (typeof req.body.noAnswer !== "undefined") {
          if (
            req.body.noAnswer.enabled &&
            broadsoftPlan.callForwarding.noAnswer.enable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.noAnswer.enable
            );
          }
          if (
            !req.body.noAnswer.enabled &&
            broadsoftPlan.callForwarding.noAnswer.disable.length
          ) {
            operations = operations.concat(
              broadsoftPlan.callForwarding.noAnswer.disable
            );
          }
        }
        if (operations.length) {
          broadSoftResponse = await broadSoftManager.execute({
            account: {
              serviceId
            },
            ...req.body,
            operations,
            businessUnit
          });
          if (
            broadSoftResponse &&
            broadSoftResponse.errors &&
            broadSoftResponse.errors.length
          ) {
            return next(
              genericError({
                status: 500,
                code: 500,
                type: "BroadSoftError",
                errors: broadSoftResponse.errors.map(error => {
                  return {
                    message: error
                  };
                })
              })
            );
          }
        }
      }
      return res.json({});
    } catch (e) {
      return next(e);
    }
  }
);
module.exports = router;
