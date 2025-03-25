"use strict";

const logger = require("./../../logger")(module);
const db = require("./../../database");
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");

module.exports = async (req, res, next) => {
  logger.info("getAccountMiddleware");
  req.params.accountId =
    (typeof req.params.accountId !== "undefined" &&
      req.params.accountId.toUpperCase()) ||
    null;
  req.params.serviceId =
    (typeof req.params.serviceId !== "undefined" &&
      req.params.serviceId.toUpperCase()) ||
    null;
  let connection = null;
  try {
    connection = await db.getIristelXConnection();
    let query = `SELECT masterAccounts.ID, masterAccounts.businessUnitId, 
        masterAccounts.code, masterAccounts.primaryContactId, masterAccounts.language, masterAccounts.name as m_name,
        masterAccounts.status as m_status, masterAccounts.createdOn as m_createdOn,
        masterAccounts.firstName as m_fname, masterAccounts.lastName as m_lname, masterAccounts.email as m_email,
        masterAccounts.updatedOn as m_updatedOn, serviceAccounts.ID as s_ID,
        serviceAccounts.masterAccount as s_masterAccount, serviceAccounts.status as s_status, serviceAccounts.name as s_name,
        serviceAccounts.primaryContactId as s_primaryContactId, serviceAccounts.code as s_code, serviceAccounts.planCode, 
        plans.planType, plans.billingType, plans.recurringCharge, plans.allotment, plans.features, plans.broadsoft, plans.ipswitch, plans.huawei, 
        plans.nextologies, serviceAccounts.legacy, serviceAccounts.sim, serviceAccounts.simModel, serviceAccounts.simType, 
        serviceAccounts.telephoneNumber, serviceAccounts.telephoneNumberModel, serviceAccounts.telephoneNumberType, 
        serviceAccounts.imei, plans.billable, plans.flatRateTariff, 
        serviceAccounts.createdOn as s_createdOn, serviceAccounts.updatedOn as s_updatedOn FROM masterAccounts
        LEFT JOIN serviceAccounts ON serviceAccounts.masterAccount = masterAccounts.ID
        LEFT JOIN plans ON plans.planCode = serviceAccounts.planCode
        WHERE masterAccounts.code = ? and masterAccounts.businessUnitId = ?`;
    const values = [req.params.accountId, req._businessUnit.businessUnitId];
    let account = await connection.query(query, values);
    connection.release();
    if (!account || (account && account[0].length < 1)) {
      return next(
        genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10020,
              message: ERROR_CODES[10020]
            }
          ]
        })
      );
    }
    const services = {};
    let accountObj = {};
    account[0].map(row => {
      accountObj.ID = row.ID;
      accountObj.code = row.code;
      accountObj.language = row.language;
      accountObj.billable = true;
      accountObj.status = row.m_status;
      accountObj.name = row.m_name;
      accountObj.billingType = "postpaid";
      accountObj.businessUnitId = row.businessUnitId;
      accountObj.primaryContactId = row.primaryContactId;
      accountObj.createdOn = row.m_createdOn;
      accountObj.updatedOn = row.m_updatedOn;
      accountObj.contact = {
        lname: row.m_lname,
        fname: row.m_fname,
        emailAddress: row.m_email
      };
      if (row.s_ID) {
        services[row.s_code] = {
          ID: row.s_ID,
          code: row.s_code,
          legacy: !!row.legacy,
          masterAccount: row.s_masterAccount,
          primaryContactId: row.s_primaryContactId,
          status: row.s_status,
          planCode: row.planCode,
          name: row.s_name,
          flatRateTariff: row.flatRateTariff,
          planType: row.planType,
          recurringCharge: row.recurringCharge,
          billable: !!row.billable,
          features: JSON.parse(row.features || null),
          broadsoft: JSON.parse(row.broadsoft || null),
          ipswitch: JSON.parse(row.ipswitch || null),
          huawei: JSON.parse(row.huawei || null),
          nextologies: JSON.parse(row.nextologies || null),
          allotment: JSON.parse(row.allotment || null),
          billingType: row.billingType,
          imei: row.imei,
          sim: row.sim,
          simModel: row.simModel,
          simType: row.simType,
          telephoneNumber: row.telephoneNumber,
          telephoneNumberModel: row.telephoneNumberModel,
          telephoneNumberType: row.telephoneNumberType,
          createdOn: row.s_createdOn,
          updatedOn: row.s_updatedOn
        };
      }
    });
    accountObj.services = services;
    req.account = accountObj;
    return next();
  } catch (e) {
    connection && connection.release();
    logger.error(e);
    return next(e);
  }
};
