"use strict";

const logger = require("./../../logger")(module);
const db = require("./../../database");
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");

module.exports = async (req, res, next) => {
  logger.info("getAccountTypeMiddleware");
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
    let query = `SELECT * FROM masterAccounts
        WHERE masterAccounts.code = ? AND masterAccounts.businessUnitId = ?`;
    const values = [req.params.accountId, req._businessUnit.businessUnitId];
    let accountObj = {};
    let account = await connection.query(query, values);
    if (!account || (account && account[0].length < 1)) {
      query = `SELECT serviceAccounts.legacy as s_legacy, masterAccounts.code as m_code, serviceAccounts.code as s_code, serviceAccounts.ID as s_ID, serviceAccounts.billable, 
            serviceAccounts.name as s_name, serviceAccounts.status as s_status, plans.billingType, plans.flatRateTariff, masterAccounts.language FROM serviceAccounts LEFT JOIN masterAccounts 
            ON masterAccounts.ID = serviceAccounts.masterAccount LEFT JOIN plans ON plans.planCode = serviceAccounts.planCode
            WHERE serviceAccounts.code = ? AND masterAccounts.businessUnitId = ?`;
      let account = await connection.query(query, values);
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
      account[0].map(row => {
        accountObj.isMaster = false;
        accountObj.legacy = !!row.s_legacy;
        accountObj.status = row.s_status;
        accountObj.parentId = row.m_code;
        accountObj.name = row.s_name;
        accountObj.ID = row.s_ID;
        accountObj.code = row.s_code;
        accountObj.billingType = row.billingType;
        accountObj.billable = !!row.billable;
        accountObj.language = row.language;
        accountObj.flatRateTariff = row.flatRateTariff;
      });
      req.account = accountObj;
    } else {
      account[0].map(row => {
        accountObj.isMaster = true;
        accountObj.name = row.name;
        accountObj.status = row.status;
        accountObj.ID = row.ID;
        accountObj.code = row.code;
        accountObj.billingType = "postpaid";
        accountObj.billable = true;
        accountObj.language = row.language;
      });
      req.account = accountObj;
    }
    return next();
  } catch (e) {
    logger.error(e);
    return next(e);
  } finally {
    connection && connection.release();
  }
};
