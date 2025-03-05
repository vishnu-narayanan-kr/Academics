"use strict";

const debug = require("debug")("manager:sim-card");
const debugTiming = require("debug")("timing");
const db = require("./../../database");
const logger = require("./../../logger")(module);
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const { NS_PER_SEC } = require("./../../utils/constants");

/**
 * Class that handles any/all functionality related to sim cards.
 */
module.exports = {
  /**
   * Return sim cards.
   *
   * @param {object} params
   * {
   *    @param {string} iccid(optional)  The iccid of the sim card(s) to retrieve.
   *    @param {string} imsi(optional)  The imsi of the sim card(s) to retrieve.
   *    @param {string} puk(optional)  The puk of the sim card(s) to retrieve.
   *    @param {string} udf1(optional)  The udf1 of the sim card(s) to retrieve.
   *    @param {string} udf2(optional)  The udf2 of the sim card(s) to retrieve.
   *    @param {string} udf3(optional)  The udf3 of the sim card(s) to retrieve.
   *    @param {string} businessUnitId(required) Business Unit ID to get sim card for.
   * }
   */
  async getSIMCards(params = {}) {
    logger.info("SIMCardManager getSimCards");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnitId === "undefined") {
      throw genericError({
        message:
          "Get SIM cards failed due to: Required iccid and/or businessUnitId are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT iccid, imsi, puk, puk2, ki, admi, udf1, udf2, udf3 FROM simCards WHERE simCards.businessUnitId = ?`;
      let values = [params.businessUnitId];
      if (params.iccid) {
        query += ` AND simCards.iccid LIKE ?`;
        values.push("%" + params.iccid + "%");
      }
      if (params.imsi) {
        query += ` AND simCards.imsi LIKE ?`;
        values.push("%" + params.imsi + "%");
      }
      if (params.puk) {
        query += ` AND simCards.puk LIKE ?`;
        values.push("%" + params.puk + "%");
      }
      if (params.udf1) {
        query += ` AND simCards.udf1 LIKE ?`;
        values.push("%" + params.udf1 + "%");
      }
      if (params.udf2) {
        query += ` AND simCards.udf2 LIKE ?`;
        values.push("%" + params.udf2 + "%");
      }
      if (params.udf3) {
        query += ` AND simCards.udf3 LIKE ?`;
        values.push("%" + params.udf3 + "%");
      }
      const simcards = await connection.query(query, values);
      query = `SELECT ma.code as accountId, sim, sa.code AS serviceId FROM serviceAccounts as sa JOIN masterAccounts AS ma ON ma.ID = sa.masterAccount WHERE sa.sim IN (?)`;
      if (simcards[0].length) {
        values = [
          simcards[0].map(simcard => {
            return simcard.iccid;
          })
        ];
        const result = await connection.query(query, values);
        simcards[0].forEach(simcard => {
          simcard.serviceId = null;
          simcard.accountId = null;
          for (let i = 0, j = result[0].length; i < j; i++) {
            let _tmp = result[0][i];
            if (_tmp.sim === simcard.iccid) {
              simcard.serviceId = _tmp.serviceId;
              simcard.accountId = _tmp.accountId;
              break;
            }
          }
        });
      }
      return simcards[0];
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `SIMCardManager getSimCards took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Retrieve specified sim card.
   *
   * @param {object} params
   * {
   *    @param {string} iccid(required)  The sim card to retrieve.
   *    @param {string} businessUnitId(required) Business Unit ID to get sim card for.
   * }
   */
  async getSIMCard(params = {}) {
    logger.info("SIMCardManager getSimCard");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.iccid === "undefined" ||
      typeof params.businessUnitId === "undefined"
    ) {
      throw genericError({
        message:
          "Get SIM card failed due to: Required iccid and/or businessUnitId are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT iccid, imsi, puk, puk2, ki, admi, udf1, udf2, udf3 FROM simCards WHERE simCards.businessUnitId = ? AND simCards.iccid = ?`;
      let values = [params.businessUnitId, params.iccid];
      let result = await connection.query(query, values);
      const simcard = result[0][0];
      if (!simcard) {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10021,
              message: ERROR_CODES[10021]
            }
          ]
        });
      }
      query = `SELECT ma.code AS accountId, sa.code AS serviceId FROM serviceAccounts AS sa JOIN masterAccounts AS ma ON ma.ID = sa.masterAccount WHERE sa.sim = ?`;
      values = [params.iccid];
      result = await connection.query(query, values);
      simcard.serviceId = (result[0][0] && result[0][0].serviceId) || null;
      simcard.accountId = (result[0][0] && result[0][0].accountId) || null;
      return simcard;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `SIMCardManager getSimCard took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
