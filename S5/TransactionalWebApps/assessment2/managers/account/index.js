"use strict";

const db = require("./../../database");
const debug = require("debug")("manager:account");
const debugTiming = require("debug")("timing");
const logger = require("./../../logger")(module);
const { mindBillService } = require("./../../services");
const dateUtils = require("./../../utils/dates");
const billingManager = require("./../../managers/billing");
const planManager = require("./../../managers/plan");
const simCardManager = require("./../../managers/sim-card");
const { genericError } = require("./../../utils/error");
const { mapProvince } = require("./../../utils/strings");
const {
  ACCOUNT_STATUSES,
  DAYS,
  NS_PER_SEC,
  USAGE_UNITS
} = require("./../../utils/constants");

const getStatusString = status => {
  return ACCOUNT_STATUSES[status] || "UNKNOWN";
};
/**
 * Class that handles any/all functionality related to accounts.
 */
module.exports = {
  /**
   * Create master account.
   *
   * @param {object} params
   * {
   *    @param {string} name(optional)  The name of the account. Will default to 'contact.fname  contact.lname'.
   *    @param {string} language(optional)  Correspondence language for this account. Default is "EN"
   *    @param {object} contact
   *    {
   *      @param {string} fname(required)  The first name of the account holder.
   *      @param {string} lname(required)  The last name of the account holder.
   *      @param {string} address1(required)  The primary mailing addresss of the account holder's billing address.
   *      @param {string} address2(optional)
   *      @param {string} address3(optional)
   *      @param {string} city(required)  The city of the account holder's billing address.
   *      @param {string} province(required)  The province of the account holder's billing address.
   *          Accepts 2-character abbreviated code, for example ON (Ontario).
   *      @param {string} country(required)  The country of the account holder's billing address.
   *          Accepts 2-character abbreviated code, for example US (United States)
   *      @param {string} postalCode(required)  The postal code of the account holder's billing address.
   *      @param {string} emailAddress(required)  The primary email address of the account holder.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async createMasterAccount(params = {}) {
    logger.info("AccountManager createMasterAccount");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.contact === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Create Master Account failed due to: One of required contact and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      const account = params;
      const masterAccount = params.businessUnit.config.mind.masterAccount;
      //TODO: MINDCODE use mind code comment next line
      // account.code = masterAccount.provider.code + Date.now();
      account.name =
        account.name || account.contact.fname + " " + account.contact.lname;
      account.type = masterAccount.type;
      account.language = (account.language || "EN").toUpperCase();
      account.provider = masterAccount.provider;
      account.product = masterAccount.product;
      account.category = masterAccount.category;
      account.class = masterAccount.class;
      account.billing = masterAccount.billing;
      account.billingType = "postpaid";
      account.shipment = masterAccount.shipment;
      account.defaultCreditScore =
        params.businessUnit.config.mind.masterAccount.defaultCreditScore ||
        null;
      if (account.shipment) {
        account.shipment.presentation_format =
          account.shipment[`presentation_format_${account.language}`];
      }
      let taxgroup = null;
      if (params.contact.province) {
        taxgroup = await this.getTaxGroup({
          province: params.contact.province
        });
      }
      if (params.contact.province && taxgroup) {
        account.tax = {
          group: taxgroup
        };
      }
      const { $ } = await mindBillService.execute({
        data: account,
        operation: "createAccount",
        errorMessage: "Create Master Account failed.",
        throwError: true
      });
      const mindId = $("account").attr("id");
      const mindAccount = await this.getAccount({
        accountId: mindId,
        businessUnit: params.businessUnit
      });
      connection = await db.getIristelXConnection();
      let query = `INSERT INTO masterAccounts (ID, code, language, primaryContactId, businessUnitId, status, firstName, lastName, city, province, country, email, name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE ID = ?, code = ?, language = ?, primaryContactId = ?, businessUnitId = ?, status = ?, firstName = ?, lastName = ?, city = ?, province = ?, country = ?, email = ?, name = ?`;
      let values = [
        mindId,
        mindAccount.mindCode, //account.code, //TODO: MINDCODE use mind code  mindAccount.mindCode,
        account.language,
        mindAccount.contact.contactId,
        params.businessUnit.businessUnitId,
        "NEW",
        params.contact.fname,
        params.contact.lname,
        params.contact.city,
        params.contact.province,
        params.contact.country,
        params.contact.emailAddress,
        params.name
      ];
      values = [...values, ...values];
      const internalAccount = await connection.query(query, values);
      //TODO: MINDCODE use mind code
      const accountCode = mindAccount.mindCode;
      if (mindAccount.contact) {
        delete mindAccount.contact.contactId;
      }
      delete mindAccount.billing;
      delete mindAccount.provisioning;
      delete mindAccount.automaticPayment;
      //TODO: MINDCODE  use mind code
      delete mindAccount.mindCode;
      return Object.assign(
        {
          accountId: accountCode, //accountId: account.code, //TODO: MINDCODE use mind code accountId: accountCode,
          language: account.language
        },
        mindAccount
      );
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager createMasterAccount took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update master/service account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id associated with this account.
   *    @param {string} language(optional)  Correspondence language for this account.
   *    @param {string} billingType(optional)  The type of billing for this account (postpaid or prepaid)
   *    @param {string} parentId(optional)  The parent account Mind id associated with this service account.
   *    @param {string} status(optional)  The service status associated with this account.
   *    @param {string} name(optional)  The account name associated with this account.
   *    @param {object} product(optional)
   *    {
   *        @param {string} planCode(required) The code representing the plan or subscription associated with this account.
   *            For a list of available plans see /plans.
   *        @param {string} type(required) The type of plan.
   *    }
   *    @param {object} contract(optional)
   *    {
   *        @param {integer} length(required) in months
   *        @param {string} startDate(optional) In format YYYYMMDD
   *    }
   *    @param {object} billing(optional)
   *    {
   *        @param {boolean} billable(required)
   *        @param {number} recurringCharge(optional) The monthly charge associated with this service
   *          (this is what the customer will actually be billed).
   *    }
   *    @param {object} contact
   *    {
   *      @param {string} contactId(required)  The primary contact id associated with this account.
   *      @param {boolean} invoice(optional)  'true' if this is the contact to invoice for this account.
   *      @param {boolean} primary(optional)  'true' if this is the primary contact for this account.
   *      @param {string} fname(optional)  The first name of the account holder.
   *      @param {string} lname(optional)  The last name of the account holder.
   *      @param {string} address1(optional)  The primary mailing addresss of the account holder's billing address.
   *      @param {string} address2(optional)
   *      @param {string} address3(optional)
   *      @param {string} city(optional)  The city of the account holder's billing address.
   *      @param {string} province(optional)  The province of the account holder's billing address.
   *           Accepts 2-character abbreviated code, for example ON (Ontario).
   *      @param {string} country(optional)  The country of the account holder's billing address.
   *           Accepts 2-character abbreviated code, for example US (United States)
   *      @param {string} postalCode(optional)  The postal code of the account holder's billing address.
   *      @param {string} emailAddress(optional)  The primary email address of the account holder.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updateAccount(params = {}) {
    logger.info("AccountManager updateAccount");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Account failed due to: One of required accountId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    if (typeof params.status !== "undefined" && params.status !== null) {
      params.status = [null, "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(
        params.status.toUpperCase()
      );
    }
    if (
      !params.status ||
      (typeof params.status !== "undefined" && params.status <= 0)
    ) {
      delete params.status;
    } else {
      params.status = {
        code: params.status
      };
    }
    let connection;
    try {
      let taxgroup = null;
      if (params.contact && params.contact.province) {
        taxgroup = await this.getTaxGroup({
          province: params.contact.province
        });
      }
      if (params.contact && params.contact.province && taxgroup) {
        params.tax = {
          group: taxgroup
        };
      }

      let serviceAccounts = [];
      if (!params.parentId) {
        const masterAccount = params.businessUnit.config.mind.masterAccount;
        if (params.language) {
          params.shipment = masterAccount.shipment;
          params.shipment.presentation_format =
            params.shipment[
              `presentation_format_${params.language.toUpperCase()}`
            ];
          //TODO:  Update all services account
          let connection;
          try {
            connection = await db.getIristelXConnection();
            let query = `SELECT serviceAccounts.ID, serviceAccounts.primaryContactId, serviceAccounts.code, plans.planCode, plans.billingType AS type FROM serviceAccounts JOIN 
              masterAccounts ON masterAccounts.ID = serviceAccounts.masterAccount JOIN plans ON 
              plans.planCode = serviceAccounts.planCode WHERE masterAccounts.businessUnitId = ? AND 
              serviceAccounts.masterAccount = ? AND UPPER(serviceAccounts.status) IN (?)`;
            let values = [
              params.businessUnit.businessUnitId,
              params.accountId,
              ["NEW", "ACTIVE", "SUSPENDED"]
            ];
            const accounts = await connection.query(query, values);
            serviceAccounts = accounts[0].map(account => {
              let accountData = {
                _accountCode: account.code,
                accountId: account.ID,
                contact: {
                  contactId: account.primaryContactId
                },
                businessUnit: params.businessUnit,
                parentId: params.accountId,
                product: {
                  planCode: account.planCode,
                  type: account.type
                }
              };
              const shipment =
                params.businessUnit.config.mind.serviceAccount[account.type];
              if (shipment) {
                shipment.presentation_format =
                  params.shipment[
                    `presentation_format_${params.language.toUpperCase()}`
                  ];
                accountData.shipment = shipment;
              }
              return accountData;
            });
            connection.release();
          } catch (e) {
            connection && connection.release();
          }
        }
      }
      const mindAccount = await this.getAccount({
        accountId: params.accountId,
        businessUnit: params.businessUnit
      });
      if (
        params.contact &&
        (typeof params.contact.address2 !== "undefined" ||
          typeof params.contact.address3 !== "undefined") &&
        typeof params.contact.address1 === "undefined"
      ) {
        params.contact.address1 = mindAccount.contact.address1;
      }

      await mindBillService.execute({
        data: params,
        operation: "updateAccount",
        errorMessage: "Update Account failed.",
        throwError: true
      });

      let tariffCode = null;
      if (params.parentId && params.product && params.product.planCode) {
        const planInfo = await planManager.getPlanDetails({
          planCode: params.product.planCode,
          businessUnit: params.businessUnit
        });
        tariffCode = planInfo.flatRateTariff;
      }
      const accountObj = {
        accountId: params.accountId,
        businessUnit: params.businessUnit
      };
      if (tariffCode) {
        accountObj.flatRateTariff = tariffCode;
      }
      const account = await this.getAccount(accountObj);
      connection = await db.getIristelXConnection();
      let query;
      if (params.parentId) {
        query = `UPDATE serviceAccounts SET`;
      } else {
        query = `UPDATE masterAccounts SET`;
      }
      let values = [];
      let flag = false;
      if (params.contact) {
        query += ` primaryContactId = ?`;
        flag = true;
        values.push(account.contact.contactId);
        if (params.contact.fname) {
          query += `, firstName = ?`;
          values.push(params.contact.fname);
        }
        if (params.contact.lname) {
          query += `, lastName = ?`;
          values.push(params.contact.lname);
        }
        if (params.contact.city) {
          query += `, city = ?`;
          values.push(params.contact.city);
        }
        if (params.contact.province) {
          query += `, province = ?`;
          values.push(params.contact.province);
        }
        if (params.contact.country) {
          query += `, country = ?`;
          values.push(params.contact.country);
        }
        if (params.contact.emailAddress) {
          query += `, email = ?`;
          values.push(params.contact.emailAddress);
        }
      }
      if (params.language && !params.parentId) {
        query += `${flag ? "," : ""} language = ?`;
        flag = true;
        values.push(params.language.toUpperCase());
      }
      if (
        params.parentId &&
        params.billing &&
        typeof params.billing.billable !== "undefined"
      ) {
        query += `${flag ? "," : ""} billable = ?`;
        flag = true;
        values.push(!!params.billing.billable);
      }
      if (params.name) {
        query += `${flag ? "," : ""} name = ?`;
        flag = true;
        values.push(params.name);
      }
      if (params.status) {
        query += `${flag ? "," : ""} status = ?`;
        flag = true;
        values.push(account.status);
      }
      if (params.parentId) {
        query += `${flag ? "," : ""} planCode = ?`;
        flag = true;
        values.push(account.provisioning.planCode);
      }

      query += ` WHERE ID = ?`;
      values.push(params.accountId);

      if (flag) {
        const result = await connection.query(query, values);
        connection.release();
      }

      //Update service accounts if applicable
      if (serviceAccounts.length) {
        for (const serviceAccount of serviceAccounts) {
          logger.info(
            `Updating service account: ${serviceAccount._accountCode}`
          );
          try {
            await this.updateAccount(serviceAccount);
          } catch (e) {
            logger.error(
              `Error updating service account: ${serviceAccount._accountCode} due to: ${e}`
            );
          }
        }
      }

      if (
        params.billing &&
        typeof params.billing.recurringCharge !== "undefined" &&
        params.billing.recurringCharge !== null
      ) {
        await mindBillService.execute({
          data: {
            // accountId: params.accountId,
            serviceId: account.service.id,
            operations: {
              update: {
                recurringCharge: params.billing.recurringCharge,
                tariffCode
              }
            },
            businessUnit: params.businessUnit
          },
          operation: "updateAccountService",
          errorMessage: "Update Account failed.",
          throwError: true
        });
        account.billing.recurringCharge = params.billing.recurringCharge;
      }
      if (account.contact) {
        delete account.contact.contactId;
      }
      if (!params.parentId) {
        delete account.billing.expirationDate;
      }
      //TODO: MINDCODE use mind code
      delete account.mindCode;
      delete account.service;
      return account;
    } catch (e) {
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager updateAccount took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Create service account information.
   *
   * @param {object} params
   * {
   *    @param {object} service(required)  The service to delete.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async deleteServiceAccount(params = {}) {
    logger.info("AccountManager deleteServiceAccount");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.service === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Delete Service Account failed due to: One of required service and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    // let connection;
    try {
      await mindBillService.execute({
        data: {
          accountId: params.service.ID,
          businessUnit: params.businessUnit
        },
        operation: "deleteAccount",
        errorMessage: `Delete Service Account failed for account: ${params.service.code}.`,
        throwError: true
      });
      // connection = await db.getIristelXConnection();
      // let query = `DELETE FROM serviceAccounts WHERE CODE = ? AND masterAccount = (SELECT ID FROM masterAccounts WHERE ID = ? AND businessUnitId = ?)`;
      // let values = [params.service.code, params.service.masterAccount, params.businessUnit.businessUnitId];
      // await connection.query(query, values);
      return {};
    } catch (e) {
      throw e;
    } finally {
      // connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager deleteServiceAccount took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Create service account information.
   *
   * @param {object} params
   * {
   *    @param {boolean} isLegacy(optional)  if this account should be treated as legacy.
   *    @param {string} name(optional)  The account name associated with this account. Will default to 'contact.fname contact.lname'.
   *    @param {string} parentId(required)  The parent account Mind id associated with this new service account.
   *    @param {string} language(required)  Correspondence language for this account. Taken from Master Account.
   *    @param {object} product(required)
   *    {
   *        @param {string} code(required) The code representing the plan or subscription associated with this account.
   *            For a list of available plans see /plans.
   *        @param {string} type(required) The type of plan.
   *    }
   *    @param {object} contract(optional)
   *    {
   *        @param {integer} length(optional) in months
   *        @param {string} startDate(required) In format YYYYMMDD
   *    }
   *    @param {object} agent(optional)  The agent associated with the creation of this account.
   *    {
   *        @param {string} agentId(required)
   *        @param {string} commissionCode(optional)
   *    }
   *    @param {object} billing(optional)
   *    {
   *        @param {boolean} billable(required)
   *        @param {number} recurringCharge(optional) The monthly charge associated with this service
   *          (this is what the customer will actually be billed).
   *    }
   *    @param {object} contact
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
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async createServiceAccount(params = {}) {
    logger.info("AccountManager createServiceAccount");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.parentId === "undefined" ||
      typeof params.product === "undefined" ||
      typeof params.contact === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Create Service Account failed due to: One of required accountId, product, contact and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    let connection;
    try {
      const accountType =
        params.businessUnit.config.mind.serviceAccount[params.product.type];
      params.name =
        params.name || params.contact.fname + " " + params.contact.lname;
      //TODO: MINDCODE use mind code comment line below
      // params.code = accountType.provider.code + Date.now();
      params.type = accountType.type;
      params.provider = accountType.provider;
      let product = params.product;
      delete params.product;
      params.category = accountType.category;
      params.class = accountType.class;
      params.billing = params.billing || {};
      params.shipment = accountType.shipment;
      params.defaultCreditScore =
        params.businessUnit.config.mind.serviceAccount[product.type]
          .defaultCreditScore || null;
      if (params.shipment) {
        params.shipment.presentation_format =
          params.shipment[
            `presentation_format_${params.language.toUpperCase()}`
          ];
      }

      let taxgroup = null;
      if (params.contact.province) {
        taxgroup = await this.getTaxGroup({
          province: params.contact.province
        });
      }
      if (params.contact.province && taxgroup) {
        params.tax = {
          group: taxgroup
        };
      }
      const { $ } = await mindBillService.execute({
        data: params,
        operation: "createAccount",
        errorMessage: "Create Service Account failed.",
        throwError: true
      });
      const mindId = $("account").attr("id");
      const planInfo = await planManager.getPlanDetails({
        planCode: product.planCode,
        businessUnit: params.businessUnit
      });
      let tariffCode = planInfo.flatRateTariff;
      const updateParams = {
        accountId: mindId,
        parentId: params.parentId,
        businessUnit: params.businessUnit,
        product: {
          type: planInfo.billingType,
          planCode: planInfo.planCode,
          flatRateTariff: planInfo.flatRateTariff
        },
        billingType: product.type
      };
      await this.updateAccount(updateParams);
      const mindAccount = await this.getAccount({
        accountId: mindId,
        flatRateTariff: tariffCode,
        businessUnit: params.businessUnit
      });
      connection = await db.getIristelXConnection();
      let query = `INSERT INTO serviceAccounts (ID, code, masterAccount, billable, primaryContactId, 
          planCode, status, firstName, lastName, city, province, country, email, name) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE ID = ?, code = ?, masterAccount = ?, billable = ?, primaryContactId = ?, planCode = ?, status = ?, firstName = ?, lastName = ?, city = ?, province = ?, country = ?, email = ?, name = ?`;
      let values = [
        mindId,
        mindAccount.mindCode, //params.code, //TODO: MINDCODE use mind code mindAccount.mindCode,
        params.parentId,
        !!params.billing.billable ? 1 : 0,
        mindAccount.contact.contactId,
        product.planCode,
        "NEW",
        params.contact.fname,
        params.contact.lname,
        params.contact.city,
        params.contact.province,
        params.contact.country,
        params.contact.emailAddress,
        params.name
      ];
      values = [...values, ...values];
      const account = await connection.query(query, values);
      if (
        typeof params.billing.recurringCharge !== "undefined" &&
        params.billing.recurringCharge !== null
      ) {
        await mindBillService.execute({
          data: {
            // accountId: mindId,
            serviceId: mindAccount.service.id,
            operations: {
              update: {
                recurringCharge: params.billing.recurringCharge,
                tariffCode
              }
            },
            businessUnit: params.businessUnit
          },
          operation: "updateAccountService",
          errorMessage: "Update Service Account failed.",
          throwError: true
        });
      }
      return {
        contract: mindAccount.contract,
        serviceId: mindAccount.mindCode, //serviceId: params.code, //TODO: MINDCODE use mind code serviceId: mindAccount.mindCode,
        recurringCharge:
          typeof params.billing.recurringCharge !== "undefined"
            ? params.billing.recurringCharge
            : mindAccount.billing.recurringCharge
      };
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager createServiceAccount took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get account information for the specified account id.
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to retrieve details for.
   *    @param {string} flatRateTariff(optional)  The tariff code for a service account.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getAccount(params = {}) {
    logger.info("AccountManager getAccount");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Account failed due to: One of required accountId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      let { $ } = await mindBillService.execute({
        data: params,
        operation: "getAccountGoodsInstancesList",
        errorMessage: "Get Account failed.",
        throwError: true
      });
      const goods_list = $("response").find("goods");
      const goods = {
        SIM: null,
        telephoneNumber: null,
        IMSI: null
      };
      goods_list &&
        goods_list.each(async (index, good) => {
          let isSim = false;
          let goodId = $(good).attr("id");
          let key = $(good)
            .find("type_code")
            .text()
            .toUpperCase();
          let value = $(good)
            .find("key")
            .text();
          if (
            [
              "SIM",
              "POSSIM",
              "IANUARIE",
              "SIMEXT",
              "SIMEXT2",
              "MSISDN",
              "MSISDNEXT",
              "MSISDNEXT2",
              "DECEMBRIE"
            ].indexOf(key) > -1
          ) {
            if (
              key === "SIM" ||
              key === "POSSIM" ||
              key === "IANUARIE" ||
              key === "SIMEXT" ||
              key === "SIMEXT2"
            ) {
              goods.SIM = value;
              isSim = true;
            }
            if (
              key === "MSISDN" ||
              key === "MSISDNEXT" ||
              key === "MSISDNEXT2" ||
              key === "DECEMBRIE"
            ) {
              goods.telephoneNumber = value;
            }
            if (isSim && goodId) {
              ({ $ } = await mindBillService.execute({
                data: { goodId, businessUnit: params.businessUnit },
                operation: "getAccountGoodsInstance",
                errorMessage: "Get Account failed.",
                throwError: true
              }));
            }
            let imsiUDF = $("response")
              .find("advanced")
              .find("udf")
              .find("system")
              .children()
              .toArray()
              .find(udf => udf.attribs.code.toUpperCase() === "IMSI");
            if (imsiUDF) {
              goods.IMSI = imsiUDF.attribs.value;
            }
          }
        });
      let recurringCharge = null;
      let expirationDate = null;
      let tariffId = null;
      let flatRateThrottlingUDF = "";
      let throttleOverrideProfile = "";
      if (params.flatRateTariff) {
        params.serviceCode = params.flatRateTariff;
        ({ $ } = await mindBillService.execute({
          data: params,
          operation: "getAccountServiceList",
          errorMessage: "Get Account failed.",
          throwError: true
        }));
        let product = $("response").find("product");
        const service_list = product.find("service");
        let serviceId = null;
        const services =
          service_list &&
          service_list.filter((index, service) => {
            const code =
              $(service)
                .children()
                .first()
                .text() || "";
            const status = parseInt(
              $(service)
                .find("status")
                .find("code")
                .text()
            );
            return code.toUpperCase() === params.flatRateTariff.toUpperCase();
          });

        if (services.length) {
          params.serviceId = $(services[services.length - 1]).attr("id");
          tariffId = params.serviceId;
          ({ $ } = await mindBillService.execute({
            data: params,
            operation: "getAccountService",
            errorMessage: "Get Account failed.",
            throwError: true
          }));
          const service = $("response").find("service");
          recurringCharge =
            parseFloat(
              service
                .find("tariff_plan")
                .find("age")
                .attr("recurring_charge")
            ) || null;
          flatRateThrottlingUDF = service
            .find("advanced")
            .children()
            .toArray()
            .find(udf => udf.attribs.code.toUpperCase() === "THROTTLING");
          if (flatRateThrottlingUDF) {
            flatRateThrottlingUDF = flatRateThrottlingUDF.children.length
              ? flatRateThrottlingUDF.children[0].data
              : "";
          } else {
            flatRateThrottlingUDF = "";
          }
          throttleOverrideProfile = service
            .find("advanced")
            .children()
            .toArray()
            .find(udf => udf.attribs.code.toUpperCase() === "OVTHROTTLING");
          if (throttleOverrideProfile) {
            throttleOverrideProfile = throttleOverrideProfile.children.length
              ? throttleOverrideProfile.children[0].data
              : "";
          } else {
            throttleOverrideProfile = "";
          }
        }
      }

      ({ $ } = await mindBillService.execute({
        data: params,
        operation: "getAccount",
        errorMessage: "Get Account failed.",
        throwError: true
      }));
      const account = $("response")
        .find("account")
        .first();
      const name = account
        .find("name")
        .first()
        .text();
      //TODO: MINDCODE use mind code uncomment line below
      const mindCode = account
        .find("code")
        .first()
        .text();
      const contractDate = account.find("contract").attr("code") || "";
      const contractStartDate =
        account.find("contract").attr("start_date") || null;
      const contractLength = account.find("contract").attr("length") || null;
      const memberSince = account.find("creation_date").text();
      const status = account
        .find("status")
        .find("code")
        .text();
      const agentList = account.find("agent_list")[0];
      let agentId = null;
      let commissionCode = null;
      if (agentList) {
        let _agent = $(agentList).find("agent");
        let _commission = _agent && _agent.find("agent_commission");
        agentId = (_agent && _agent.attr("code")) || null;
        commissionCode =
          (_commission &&
            _commission.find("default") &&
            _commission.find("default").attr("code")) ||
          null;
      }
      let iristelx = account
        .find("advanced")
        .children()
        .toArray()
        .find(udf => udf.attribs.code.toUpperCase() === "IRISTELX");
      if (iristelx) {
        iristelx = iristelx.children.length ? iristelx.children[0].data : "";
      } else {
        iristelx = "";
      }
      const contact_list = account.find("contact_list")[0];
      const primaryContact =
        contact_list &&
        contact_list.children.find(contact => $(contact).attr("primary"));
      const contact = {};
      if (primaryContact) {
        const primaryContactElement = $(primaryContact);
        contact.contactId = primaryContactElement.attr("id");
        contact.fname = primaryContactElement
          .find("name")
          .find("first")
          .text();
        contact.lname = primaryContactElement
          .find("name")
          .find("last")
          .text();
        contact.address1 = primaryContactElement
          .find("address")
          .find("line1")
          .text();
        contact.address2 = primaryContactElement
          .find("address")
          .find("line2")
          .text();
        contact.address3 = primaryContactElement
          .find("address")
          .find("line3")
          .text();
        contact.city = primaryContactElement.find("city").text();
        contact.province = mapProvince(
          primaryContactElement.find("state").text()
        );
        contact.postalCode = primaryContactElement.find("zip").text();
        contact.country = primaryContactElement.find("country").text();
        contact.emailAddress = primaryContactElement.find("email").text();
        contact.phone = {};
        contact.phone.home = primaryContactElement
          .find("phone")
          .find("home")
          .text();
        contact.phone.business = primaryContactElement
          .find("phone")
          .find("business")
          .text();
        contact.phone.mobile = primaryContactElement
          .find("phone")
          .find("mobile")
          .text();
      }
      const billParentAccount = account.find("billable").text() !== "true";
      const planCode = account.find("product").attr("code");
      expirationDate = dateUtils.formatDate(
        account.find("paid_until_date").text()
      );
      const automaticPayment = {};
      const creditCard = {};
      const paymentSettings = account.find("payment_settings");
      automaticPayment.enabled =
        paymentSettings.find("direct").attr("enable") === "true";
      automaticPayment.paymentType = paymentSettings
        .find("direct")
        .find("type")
        .text();
      automaticPayment.onDeclineSuspend =
        paymentSettings
          .find("direct")
          .find("suspend_account_on_reject")
          .text() === "true";
      creditCard.cardType = paymentSettings
        .find("credit_card")
        .find("code")
        .text();
      creditCard.last4digits =
        paymentSettings
          .find("credit_card")
          .find("number")
          .text() || "";
      if (creditCard.last4digits !== "") {
        creditCard.last4digits = creditCard.last4digits.substr(-4);
      }
      creditCard.holder = paymentSettings
        .find("credit_card")
        .find("holder")
        .text();
      creditCard.expMonth = paymentSettings
        .find("credit_card")
        .find("expiration")
        .find("month")
        .text();
      creditCard.expYear = paymentSettings
        .find("credit_card")
        .find("expiration")
        .find("year")
        .text();
      automaticPayment.creditCard = creditCard;
      const onDaysAvailable = {
        enabled:
          paymentSettings
            .find("recharge_event")
            .find("on_reaching_days")
            .text() === "true",
        trigger:
          parseInt(
            paymentSettings
              .find("debit_recharge_on_days")
              .find("days")
              .text()
          ) || null,
        amount:
          parseFloat(
            paymentSettings
              .find("debit_recharge_on_days")
              .find("amount")
              .text()
          ) ||
          recurringCharge ||
          null
      };
      const onDayOfMonth = {
        enabled:
          paymentSettings
            .find("recharge_event")
            .find("on_reaching_day_of_month")
            .text() === "true",
        trigger:
          parseInt(
            paymentSettings
              .find("debit_recharge_on_day_of_month")
              .find("day_of_month")
              .text()
          ) || null,
        amount:
          parseFloat(
            paymentSettings
              .find("debit_recharge_on_day_of_month")
              .find("amount_day_of_month")
              .text()
          ) || null
      };
      const onBalanceBelow = {
        enabled:
          paymentSettings
            .find("recharge_event")
            .find("on_remaining_threshold")
            .text() === "true",
        trigger:
          parseInt(
            paymentSettings
              .find("debit_recharge")
              .find("threshold")
              .text()
          ) || null,
        amount:
          parseFloat(
            paymentSettings
              .find("debit_recharge")
              .find("amount")
              .text()
          ) || null
      };
      automaticPayment.onDaysAvailable = onDaysAvailable;
      automaticPayment.onDayOfMonth = onDayOfMonth;
      automaticPayment.onBalanceBelow = onBalanceBelow;
      try {
        const paymentInfo = await billingManager.getPaymentTypeInfoByCode({
          code: automaticPayment.paymentType,
          businessUnitId: params.businessUnit.businessUnitId
        });
        automaticPayment.paymentType = paymentInfo.paymentType;
      } catch (e) {
        //TODO: what do we do here????
        automaticPayment.paymentType = null;
      }
      const accountObj = Object.assign(
        {
          status: getStatusString(status)
        },
        {
          //TODO: MINDCODE use mind code mindCode,
          mindCode,
          // contractDate,
          memberSince,
          contact,
          name,
          provider: params.businessUnit.providerCode,
          agent: {
            agentId,
            commissionCode
          },
          billing: {
            billParentAccount,
            recurringCharge: recurringCharge || null,
            expirationDate
          },
          provisioning: {
            planCode
          },
          udf: {
            iristelx,
            flatRateThrottlingUDF,
            throttleOverrideProfile
          },
          automaticPayment,
          service: {
            id: tariffId
          },
          contract: {
            startDate: dateUtils.formatDate(contractStartDate),
            length: parseInt(contractLength) || null
          }
        }
      );
      Object.assign(accountObj.provisioning, goods);
      return accountObj;
    } catch (e) {
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager getAccount took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get accounts for the specified business unit.
   * @param {object} params
   * {
   *    @param {string} query(optional) Search string.
   *    @param {array} status(optional) Array of status strings.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   *    @param {number} page(optional) Defaults to 1.
   *    @param {number} pageLimit(optional) Defaults to 10.
   * }
   */
  async getAccounts(params = {}) {
    logger.info("AccountManager getAccounts");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnit === "undefined") {
      throw genericError({
        message:
          "Get Accounts failed due to: Required businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      params.provider = params.businessUnit.config.mind.masterAccount.provider;
      connection = await db.getIristelXConnection();
      // TODO: remove this when dev db is moved to  AWS
      if (process.env.NODE_ENV !== "production") {
        await connection.query(`SET group_concat_max_len = 100000`);
      }
      const countQuery = `SELECT COUNT(*) as count FROM masterAccounts`;
      const detailsQuery = `SELECT services, masterAccounts.name, masterAccounts.ID, masterAccounts.code, masterAccounts.language, masterAccounts.status, masterAccounts.firstName, masterAccounts.lastName, 
      masterAccounts.city, masterAccounts.province, masterAccounts.email FROM masterAccounts LEFT JOIN (SELECT concat('[',GROUP_CONCAT(JSON_OBJECT( 'serviceId', serviceAccounts.code, 'legacy',serviceAccounts.legacy, 'name',serviceAccounts.name, 
      'code',serviceAccounts.code, 'imei',serviceAccounts.imei, 'sim',serviceAccounts.sim, 'telephoneNumber',serviceAccounts.telephoneNumber, 'status',serviceAccounts.status, 'planCode',serviceAccounts.planCode, 
      'firstName',serviceAccounts.firstName, 'lastName',serviceAccounts.lastName, 'city',serviceAccounts.city, 'province',serviceAccounts.province, 'email',serviceAccounts.email) SEPARATOR ','),']') AS services, 
      masterAccount FROM serviceAccounts  GROUP BY serviceAccounts.masterAccount) AS serviceAccounts ON (masterAccounts.ID=serviceAccounts.masterAccount)`;
      let query = ` WHERE masterAccounts.businessUnitId = ?`;
      const values = [params.businessUnit.businessUnitId];
      if (params.query) {
        query += ` AND LOWER(CONCAT(code, " ", IFNULL(firstName, ""), " ", IFNULL(lastName, ""), " ", IFNULL(email, ""))) LIKE ?`;
        values.push("%" + params.query + "%");
      }
      if (
        params.status &&
        Array.isArray(params.status) &&
        params.status.length
      ) {
        params.status = params.status.map(status => "" + status.toUpperCase());
        query += ` AND UPPER(masterAccounts.status) IN (?)`;
        values.push(params.status);
      }
      query += ` ORDER BY masterAccounts.code`;
      const [pagination, _fields] = await connection.query(
        `${countQuery} ${query}`,
        values
      );
      const count = pagination[0].count;
      const page = parseInt(params.page || 1);
      const pageLimit = parseInt(params.pageLimit || process.env.PAGE_LIMIT);
      values.push(pageLimit, (page - 1) * pageLimit);
      const accounts = await connection.query(
        `${detailsQuery} ${query} LIMIT ? OFFSET ?`,
        values
      );
      const masterAccounts = accounts[0].map(account => {
        return {
          accountId: account.code,
          name: account.name,
          contact: {
            fname: account.firstName,
            lname: account.lastName,
            city: account.city,
            province: mapProvince(account.province),
            country: account.country,
            emailAddress: account.email
          },
          language: account.language,
          status: account.status,
          provider: params.businessUnit.providerCode,
          services: JSON.parse(account.services || "[]").map(acc => {
            acc.accountId = account.code;
            acc.provider = params.businessUnit.providerCode;
            return acc;
          })
        };
      });
      return {
        total: count,
        totalPages: Math.ceil(count / pageLimit) || 0,
        pageLimit,
        page,
        accounts: masterAccounts
      };
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager getAccounts took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get service accounts for the specified master account.
   * @param {object} params
   * {
   *    @param {string} query(optional) Search string.
   *    @param {array} status(optional) Array of status strings.
   *    @param {string} accountId(optional) The account id to retrieve service acccounts for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   *    @param {number} page(optional) Defaults to 1.
   *    @param {number} pageLimit(optional) Defaults to 10.
   * }
   */
  async getServiceAccounts(params = {}) {
    logger.info("AccountManager getServiceAccounts");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnit === "undefined") {
      throw genericError({
        message:
          "Get Service Accounts failed due to: Required businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      const countQuery = `SELECT COUNT(*) as count FROM serviceAccounts JOIN masterAccounts ON serviceAccounts.masterAccount = masterAccounts.ID`;
      const detailsQuery = `SELECT serviceAccounts.legacy, serviceAccounts.name, serviceAccounts.code, masterAccounts.code as master, serviceAccounts.imei, serviceAccounts.sim, serviceAccounts.telephoneNumber, serviceAccounts.status, serviceAccounts.planCode, serviceAccounts.firstName, serviceAccounts.lastName, serviceAccounts.city, serviceAccounts.province, serviceAccounts.email FROM serviceAccounts JOIN masterAccounts ON serviceAccounts.masterAccount = masterAccounts.ID`;
      let query = ` WHERE masterAccounts.businessUnitId = ?`;
      const values = [params.businessUnit.businessUnitId];
      if (params.accountId) {
        query += ` AND masterAccounts.ID = ?`;
        values.push(params.accountId);
      }
      if (params.query) {
        query += ` AND LOWER(CONCAT(serviceAccounts.code, " ", IFNULL(serviceAccounts.firstName, ""), " ", IFNULL(serviceAccounts.lastName, ""), " ", IFNULL(serviceAccounts.email, ""), " ", IFNULL(serviceAccounts.sim, ""), " ", IFNULL(serviceAccounts.telephoneNumber, ""), " ", IFNULL(serviceAccounts.imei, ""))) LIKE ?`;
        // query += ` AND LOWER(CONCAT(serviceAccounts.code, " ", IFNULL(serviceAccounts.firstName, ""), " ", IFNULL(serviceAccounts.lastName, ""), " ", IFNULL(serviceAccounts.email, ""))) LIKE ?`;
        values.push("%" + params.query + "%");
      }
      //   if (params.sim) {
      //     query += ` AND serviceAccounts.sim LIKE ?`;
      //     values.push("%" + params.sim + "%");
      //   }
      //  if (params.telephoneNumber) {
      //     query += ` AND serviceAccounts.telephoneNumber LIKE ?`;
      //     values.push("%" + params.telephoneNumber + "%");
      //   }
      if (
        params.status &&
        Array.isArray(params.status) &&
        params.status.length
      ) {
        params.status = params.status.map(status => "" + status.toUpperCase());
        query += ` AND UPPER(serviceAccounts.status) IN (?)`;
        values.push(params.status);
      }
      query += ` ORDER BY serviceAccounts.code`;
      const [pagination, _fields] = await connection.query(
        `${countQuery} ${query}`,
        values
      );
      const count = pagination[0].count;
      const page = parseInt(params.page || 1);
      const pageLimit =
        params.pageLimit === "all"
          ? 100000000
          : parseInt(params.pageLimit || process.env.PAGE_LIMIT);
      values.push(pageLimit, (page - 1) * pageLimit);
      const accounts = await connection.query(
        `${detailsQuery} ${query} LIMIT ? OFFSET ?`,
        values
      );
      const serviceAccounts = accounts[0].map(account => {
        let accountData = {
          name: account.name,
          serviceId: account.code,
          accountId: account.master,
          contact: {
            fname: account.firstName,
            lname: account.lastName,
            city: account.city,
            province: mapProvince(account.province),
            country: account.country,
            emailAddress: account.email
          },
          legacy: !!account.legacy,
          sim: account.sim,
          imei: account.imei,
          telephoneNumber: account.telephoneNumber,
          status: account.status,
          planCode: account.planCode,
          provider: params.businessUnit.providerCode
        };
        return accountData;
      });
      return {
        total: count,
        totalPages: Math.ceil(count / pageLimit) || 0,
        pageLimit,
        page,
        services: serviceAccounts
      };
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager getServiceAccounts took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get service account.
   * @param {object} params
   * {
   *    @param {string} serviceId(required) The service id of the service acccount to retrieve
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getServiceAccount(params = {}) {
    logger.info("AccountManager getServiceAccount");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.serviceId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Service Account failed due to: One of required serviceId/businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT masterAccounts.code as master, serviceAccounts.name, serviceAccounts.code, serviceAccounts.status, serviceAccounts.imei, serviceAccounts.sim, serviceAccounts.telephoneNumber, serviceAccounts.status, serviceAccounts.planCode, serviceAccounts.firstName, serviceAccounts.lastName, serviceAccounts.city, serviceAccounts.province, serviceAccounts.email from serviceAccounts JOIN masterAccounts WHERE masterAccounts.businessUnitId = ? AND serviceAccounts.code = ? AND serviceAccounts.masterAccount = masterAccounts.ID`;
      const values = [params.businessUnit.businessUnitId, params.serviceId];
      const accounts = await connection.query(query, values);
      const serviceAccounts = accounts[0].map(account => {
        let accountData = {
          name: account.name,
          accountId: account.master,
          serviceId: account.code,
          contact: {
            fname: account.firstName,
            lname: account.lastName,
            city: account.city,
            province: mapProvince(account.province),
            country: account.country,
            emailAddress: account.email
          },
          sim: account.sim,
          imei: account.imei,
          telephoneNumber: account.telephoneNumber,
          status: account.status,
          planCode: account.planCode,
          provider: params.businessUnit.providerCode
        };
        return accountData;
      });
      return serviceAccounts;
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager getServiceAccount took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update plan on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to make a payment for.
   *    @param {string} planCode(required)  The code representing the plan or subscription associated with this account.
   *            For a list of available plans see /plans.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updatePlanProvisioning(params = {}) {
    logger.info("AccountManager updatePlanProvisioning");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.planCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Account Plan Provisioning failed due to: One of required accountId, planCode and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      params.product = {
        planCode: params.planCode
      };
      delete params.planCode;
      await mindBillService.execute({
        data: params,
        operation: "updateAccount",
        errorMessage: "Update Account Plan Provisioning failed.",
        throwError: true
      });
      return {};
    } catch (e) {
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager updatePlanProvisioning took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update sim on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} serviceId(required)  The service id to update the sim.
   *    @param {string} serviceCode(required)  The service code to update the sim.
   *    @param {string} billingType(required)  The billing type of the service.
   *    @param {string} accountId(required)  The master account
   *    @param {string} oldModel(optional) The old goods model.
   *    @param {string} oldType(optional) The old goods type.
   *    @param {string} oldSim(optional)  The SIM Card ICCID that is associated with this account.
   *    @param {string} newSim(required)  The new SIM Card ICCID to be associated with this account.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updateSimProvisioning(params = {}) {
    logger.info("AccountManager updateSimProvisioning");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.serviceId === "undefined" ||
      typeof params.billingType === "undefined" ||
      typeof params.serviceCode === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.newSim === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Account SIM Provisioning failed due to: One of required serviceId, serviceCode, billingType, accountId, sim and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    const serviceId = params.serviceId;
    const serviceCode = params.serviceCode;
    const accountId = params.accountId;
    params.newModel = params.businessUnit.config.mind.goods.sim.model;
    params.newType = params.businessUnit.config.mind.goods.sim.type;
    params.oldItem = params.oldSim || null;
    params.newItem = params.newSim;
    params.price = {
      amount: {
        value: 0,
        currencyCode: "CAD"
      },
      discount: {
        value: 0,
        percentage: 0,
        currencyCode: "CAD"
      }
    };
    let firstOperation = "addAccountGoodsInstance";
    let secondOperation = null;
    if (params.oldItem) {
      if (
        params.oldType !== params.newType ||
        params.oldModel !== params.newModel
      ) {
        if (!params.oldType || !params.oldModel) {
          throw genericError({
            message: `Update Account SIM Provisioning failed due to: Missing old SIM type and/or model.`,
            status: 400,
            code: 400
          });
        }
        firstOperation = "returnAccountGoodsInstance";
        secondOperation = "addAccountGoodsInstance";
      } else {
        firstOperation = "replaceAccountGoodsInstance";
      }
    }
    if (params.newItem === null) {
      if (firstOperation === "returnAccountGoodsInstance") {
        secondOperation = null;
      } else {
        firstOperation = "cancelAccountGoodsInstance";
      }
    }

    let connection;
    try {
      if (params.newItem) {
        const sim = await simCardManager.getSIMCard({
          iccid: params.newSim,
          businessUnitId: params.businessUnit.businessUnitId
        });
        if (sim && sim.serviceId) {
          throw genericError({
            message: `Update Account SIM Provisioning failed due to: SIM: ${params.newSim} already in use.`,
            status: 400,
            code: 400
          });
        }
        params.advanced = [
          {
            code: "IMSI",
            value: sim.imsi
          }
        ];
      }
      params.accountId = serviceId;
      let { parsedError } = await mindBillService.execute({
        data: params,
        operation: firstOperation,
        throwError: false
      });
      if (parsedError.code !== null) {
        const code = parsedError.code;
        const message = parsedError.message;
        if (code === "101550" || code === "101452") {
          throw genericError({
            message: "Update Account SIM Provisioning failed.",
            status: 403,
            code: 403,
            errors: [
              {
                code,
                message
              }
            ]
          });
        }
        throw genericError({
          message: "Update Account SIM Provisioning failed.",
          status: 500,
          code: 500,
          errors: [
            {
              code,
              message
            }
          ]
        });
      }
      if (secondOperation) {
        let { parsedError } = await mindBillService.execute({
          data: params,
          operation: secondOperation,
          throwError: false
        });
        if (parsedError.code !== null) {
          const code = parsedError.code;
          const message = parsedError.message;
          if (code === "101550" || code === "101452") {
            throw genericError({
              message: "Update Account SIM Provisioning failed.",
              status: 403,
              code: 403,
              errors: [
                {
                  code,
                  message
                }
              ]
            });
          }
          throw genericError({
            message: "Update Account SIM Provisioning failed.",
            status: 500,
            code: 500,
            errors: [
              {
                code,
                message
              }
            ]
          });
        }
      }
      connection = await db.getIristelXConnection();
      let query = `UPDATE serviceAccounts SET sim = ?, simModel = ?, simType = ? WHERE serviceAccounts.ID = ?`;
      let model = null;
      let type = null;
      if (params.newItem !== null) {
        model = params.businessUnit.config.mind.goods.sim.model;
        type = params.businessUnit.config.mind.goods.sim.type;
      }
      const values = [params.newSim, model, type, serviceId];
      const account = await connection.query(query, values);
      return {
        sim: params.newSim
      };
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager updateSimProvisioning took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update imei on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to update the imei for.
   *    @param {string} imei(required)  The device IMEI to be associated with this account. (Needed if IMEI is not BYOD)
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *      services.
   * }
   */
  async updateImeiProvisioning(params = {}) {
    logger.info("AccountManager updateImeiProvisioning");
    const _timeStart = process.hrtime();
    if (
      !params ||
      !params.accountId ||
      !params.businessUnit ||
      typeof params.imei === "undefined"
    ) {
      throw genericError({
        message:
          "Update Account IMEI Provisioning failed due to: One of required accountId,imei and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `UPDATE serviceAccounts SET imei = ? WHERE code = ?`;
      const values = [params.imei, params.accountId];
      const account = await connection.query(query, values);
      return {
        imei: params.imei
      };
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager updateImeiProvisioning took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get usage for specified account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The master account code of the service account to retrieve the usage for.
   *    @param {string} service(required)  The service object of the service to retrieve the usage for.
   *	  @param {string} type(required) The type of service to get the usage for.
   *    @param {object} filters(required) The filter object to use. {
   *				@param {string} invoiceId(optional) The invoice number to get the usage for.
   *				@param {boolean} newUsage(optional) Get only current/unbilled usage.
   *				@param {string} fromDate(optional but required with toDate) The starting date to get the usage for in format YYYY-MM-DD.
   *				@param {string} toDate(optional but required with fromDate) The ending date to get the usage for in format YYYY-MM-DD.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getUsage(params = {}) {
    logger.info("AccountManager getUsage");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.service === "undefined" ||
      typeof params.type === "undefined" ||
      typeof params.filters === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Account Usage failed due to: One of required accountId, service, type, filters, and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    let connection = null;
    try {
      const masterAccountCode = params.accountId;
      const serviceAccountCode = params.service.code;
      let data = [];
      let fields = null;
      if (
        params.filters.invoiceId ||
        (params.filters.fromDate && params.filters.toDate)
      ) {
        connection = await db.getIristelXConnection();
        let query = `SELECT data FROM usageInfo WHERE masterAccountCode=? AND serviceAccountCode=? AND type=?`;
        let values = [masterAccountCode, serviceAccountCode, params.type];
        if (params.filters.invoiceId) {
          query += ` AND invoiceId=?`;
          values.push(params.filters.invoiceId);
        } else if (params.filters.fromDate && params.filters.toDate) {
          query += ` AND fromDate=? AND toDate=?`;
          params.filters.fromDate = params.filters.fromDate.replace(/-/g, "");
          params.filters.toDate = params.filters.toDate.replace(/-/g, "");
          values.push(params.filters.fromDate, params.filters.toDate);
        }
        [data, fields] = await connection.query(query, values);
      }
      if (data.length) {
        return JSON.parse(data[0].data);
      } else {
        let { $ } = await mindBillService.execute({
          data: {
            accountId: params.service.ID,
            businessUnit: params.businessUnit
          },
          operation: "getAccountServiceList",
          errorMessage: "Get Usage failed.",
          throwError: true
        });
        let product = $("response").find("product");
        const service_list = product.find("service");
        const service = service_list.toArray().find(e => {
          return e.children.find(r => {
            if (r.name === "type") {
              return (r.childNodes[0] || {}).data === params.type;
            }
          });
        });
        if (!service) {
          throw genericError({
            message: `Get Usage failed. No Service type of ${params.type} was found for this account.`,
            status: 404,
            code: 404,
            errors: []
          });
        }

        let invoice = null;
        if (params.filters.invoiceId) {
          invoice = await billingManager.getInvoice({
            accountId: params.service.billable
              ? params.service.code
              : params.accountId,
            invoiceId: params.filters.invoiceId,
            businessUnit: params.businessUnit
          });
          delete params.filters.fromDate;
          delete params.filters.toDate;
          delete params.filters.newUsage;
          params.filters.invoiceNumber = invoice.invoiceNumber;
        } else if (params.filters.fromDate && params.filters.toDate) {
          // params.filters.fromDate = params.filters.fromDate.replace(/-/g, "");
          // params.filters.toDate = params.filters.toDate.replace(/-/g, "");
          delete params.filters.newUsage;
        } else {
          params.filters.newUsage = true;
        }
        // map the service id of type
        params.serviceId = service.attribs.id;
        // reassign accountId to the service account Id
        params.accountId = params.service.ID;
        ({ $ } = await mindBillService.execute({
          data: params,
          operation: "getAccountServiceUsage",
          errorMessage: "Get Account Usage failed.",
          throwError: true
        }));

        //Types of usage
        //"ASDL", "GPRS", "FAX", "MOBILEINC", "MOBILEOUT", "RGPRS", "RMOBILEINC", "RMOBILEOUT", "RSMSINC", "RSMSOUT", "SMSINC", "SMSOUT", "VOIP"

        const usageDetails = $("usage_details")
          .children()
          .toArray();
        let actualUsage = 0;
        let billableUsage = 0;
        let units = null;
        let totalCharges = 0;
        const details = usageDetails.map(udr => {
          let msisdn = udr.children.find(child => child.name === "account_ani");
          msisdn = msisdn.children[0].data || "";
          let startDate = udr.children.find(
            child => child.name === "start_date"
          );
          startDate = startDate.children[0].data;
          let startTime = udr.children.find(
            child => child.name === "start_time"
          );
          startTime = startTime.children[0].data;
          let dayOfWeek = udr.children.find(
            child => child.name === "day_of_week"
          );
          dayOfWeek = dayOfWeek.children[0].data;
          let destinationNumber = udr.children.find(
            child => child.name === "destination_number"
          );
          destinationNumber = destinationNumber.children[0].data || "";
          let totalCharge = udr.children.find(
            child => child.name === "total_charge"
          );
          totalCharge = parseFloat(totalCharge.children[0].data);
          totalCharges += totalCharge;
          let duration = udr.children.find(child => child.name === "duration");
          units = USAGE_UNITS[duration.attribs.unit_code] || null;
          actualUsage +=
            typeof duration.attribs.actual === "undefined"
              ? 1
              : parseInt(duration.attribs.actual);
          billableUsage +=
            typeof duration.attribs.billable === "undefined"
              ? 1
              : parseInt(duration.attribs.billable);
          let invoiceId = udr.children.find(
            child => child.name === "invoice_id"
          );
          invoiceId =
            (invoiceId &&
              invoiceId.children[0] &&
              invoiceId.children[0].data) ||
            null;
          let basicTypeSpecific = udr.children.find(
            child => child.name === "basic_type_specific"
          );
          let voip = basicTypeSpecific.children.find(
            child => child.name === "voip"
          );
          let airCharge = voip.children.find(
            child => child.name === "air_charge"
          );
          airCharge = parseFloat(airCharge.children[0].data);
          let tollCharge = voip.children.find(
            child => child.name === "toll_charge"
          );
          tollCharge = parseFloat(tollCharge.children[0].data);
          let callTypeDescription = voip.children.find(
            child => child.name === "call_type_description"
          );
          callTypeDescription = callTypeDescription.children[0].data || "";
          return {
            msisdn,
            startDate,
            startTime,
            dayOfWeek,
            dayLabel: DAYS[dayOfWeek],
            usage: {
              actual: duration.attribs.actual,
              billable: duration.attribs.billable
            },
            destinationNumber,
            totalCharge,
            units,
            invoiceId,
            airCharge,
            tollCharge,
            callTypeDescription
          };
        });
        const info = {
          totalCharges,
          actualUsage,
          billableUsage,
          units,
          data: details
        };
        const today = new Date()
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "");
        if (
          params.filters.invoiceId ||
          (params.filters.fromDate &&
            params.filters.toDate &&
            params.filters.fromDate.substring(0, 6) < today.substring(0, 6))
        ) {
          let query = `INSERT INTO usageInfo (masterAccountCode, serviceAccountCode, type, invoiceId, fromDate, toDate, data) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          let values = [
            masterAccountCode,
            serviceAccountCode,
            params.type,
            params.filters.invoiceId || null,
            params.filters.fromDate || null,
            params.filters.toDate || null,
            JSON.stringify(info)
          ];
          try {
            await connection.query(query, values);
          } catch (e) {
            logger.error(`Error caching usage data due to: ${e}`);
          }
        }
        return info;
      }
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager getUsage took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get tax group.
   *
   * @param {object} params
   * {
   *    @param {string} province(required)  The province to retrieve the tax group for.
   * }
   */
  async getTaxGroup(params = {}) {
    logger.info("AccountManager getTaxGroup");
    const _timeStart = process.hrtime();
    if (!params || typeof params.province === "undefined") {
      throw genericError({
        message: "Get Tax Group failed due to: Required province is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT taxGroup FROM taxGroups WHERE province = ?`;
      const values = [params.province];
      const taxgroup = await connection.query(query, values);
      if (taxgroup[0].length !== 1) {
        throw genericError({
          message: `Get Tax Group failed due to : Invalid tax group.`,
          status: 400,
          code: 400
        });
      }
      return taxgroup[0][0].taxGroup;
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager getTaxGroup took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update telephone number on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} serviceId(required)  The service id to update the telephone number for.
   *    @param {string} serviceCode(required)  The service code to update the telephone number for.
   *    @param {string} billingType(required)  The billing type of the service.
   *    @param {string} accountId(required)  The master account
   *    @param {string} oldModel(required) The old goods model.
   *    @param {string} oldType(required) The old goods type.
   *    @param {string} oldTelephoneNumber(optional)  The telephone number.
   *    @param {string} newTelephoneNumber(required)  The telephone number.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updateTelephoneNumber(params = {}) {
    logger.info("AccountManager updateTelephoneNumber");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.serviceId === "undefined" ||
      typeof params.billingType === "undefined" ||
      typeof params.serviceCode === "undefined" ||
      typeof params.accountId === "undefined" ||
      typeof params.newTelephoneNumber === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Account Telephone Number failed due to: One of required serviceId, serviceCode, accountId, billingType, telephoneNumber and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    const serviceId = params.serviceId;
    const serviceCode = params.serviceCode;
    const accountId = params.accountId;

    params.newModel =
      params.businessUnit.config.mind.goods.telephoneNumber.model;
    params.newType = params.businessUnit.config.mind.goods.telephoneNumber.type;
    params.oldItem = params.oldTelephoneNumber || null;
    params.newItem = params.newTelephoneNumber;
    params.price = {
      amount: {
        value: 0,
        currencyCode: "CAD"
      },
      discount: {
        value: 0,
        percentage: 0,
        currencyCode: "CAD"
      }
    };

    let firstOperation = "addAccountGoodsInstance";
    let secondOperation = null;
    if (params.oldItem) {
      if (
        params.oldType !== params.newType ||
        params.oldModel !== params.newModel
      ) {
        if (!params.oldType || !params.oldModel) {
          throw genericError({
            message: `Update Account Telephone Number failed due to: Missing old Telephone Number type and/or model.`,
            status: 400,
            code: 400
          });
        }
        firstOperation = "returnAccountGoodsInstance";
        secondOperation = "addAccountGoodsInstance";
      } else {
        firstOperation = "replaceAccountGoodsInstance";
      }
    }
    if (params.newItem === null) {
      firstOperation = "returnAccountGoodsInstance";
      secondOperation = null;
      // if (firstOperation === "returnAccountGoodsInstance") {
      //   secondOperation = null;
      // } else {
      //   firstOperation = "cancelAccountGoodsInstance";
      // }
    }
    params.accountId = serviceId;
    let connection;
    try {
      let { parsedError } = await mindBillService.execute({
        data: params,
        operation: firstOperation,
        throwError: false
      });
      if (parsedError.code !== null) {
        const code = parsedError.code;
        const message = parsedError.message;
        if (code === "101550" || code === "101452") {
          throw genericError({
            message: "Update Account Telephone Number failed.",
            status: 403,
            code: 403,
            errors: [
              {
                code,
                message
              }
            ]
          });
        }
        throw genericError({
          message: "Update Account Telephone Number failed.",
          status: 500,
          code: 500,
          errors: [
            {
              code,
              message
            }
          ]
        });
      }
      if (secondOperation) {
        let { parsedError } = await mindBillService.execute({
          data: params,
          operation: secondOperation,
          throwError: false
        });

        if (parsedError.code !== null) {
          const code = parsedError.code;
          const message = parsedError.message;
          if (code === "101550" || code === "101452") {
            throw genericError({
              message: "Update Account Telephone Number failed.",
              status: 403,
              code: 403,
              errors: [
                {
                  code,
                  message
                }
              ]
            });
          }
          throw genericError({
            message: "Update Account Telephone Number failed.",
            status: 500,
            code: 500,
            errors: [
              {
                code,
                message
              }
            ]
          });
        }
      }
      return {
        telephoneNumber: params.newTelephoneNumber
      };
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AccountManager updateTelephoneNumber took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
