"use strict";

const debug = require("debug")("manager:plan");
const debugTiming = require("debug")("timing");
const db = require("./../../database");
const logger = require("./../../logger")(module);
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const { NS_PER_SEC } = require("./../../utils/constants");

/**
 * Class that handles any/all functionality related to plans.
 */
module.exports = {
  /**
   * Get plans for specified business unit.
   *
   * @param {object} params
   * {
   *    @param {array} billingTypes(optional)  Array of billing types
   *    @param {number} status(optional)   Status number string.
   *    @param {object} businessUnit(required)  The business unit to retrieve plans for.
   * }
   */
  async getPlans(params = {}) {
    logger.info("PlanManager getPlans");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnit === "undefined") {
      throw genericError({
        message: "Get plans failed due to: Required businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT * FROM plans 
        INNER JOIN businessUnits ON plans.businessUnitId = businessUnits.businessUnitId 
        WHERE plans.businessUnitId = ?`;
      const values = [params.businessUnit.businessUnitId];
      if (
        params.billingTypes &&
        Array.isArray(params.billingTypes) &&
        params.billingTypes.length > 0
      ) {
        params.billingTypes = params.billingTypes.map(
          billingType => "" + billingType.toLowerCase()
        );
        query += ` AND plans.billingType IN (?)`;
        values.push(params.billingTypes);
      }
      if (params.status !== null) {
        query += ` AND plans.status = ?`;
        values.push(params.status);
      }
      let plans = await connection.query(query, values);
      plans = (plans[0] || []).map(plan => {
        plan.active = !!plan.status;
        plan.allotment = JSON.parse(plan.allotment || null);
        // plan.broadsoft = JSON.parse(plan.broadsoft || null);
        // plan.ipswitch = JSON.parse(plan.ipswitch || null);
        // plan.huawei = JSON.parse(plan.huawei || null);
        // plan.nextologies = JSON.parse(plan.nextologies || null);
        delete plan.usage;
        delete plan.broadsoft;
        delete plan.ipswitch;
        delete plan.huawei;
        delete plan.nextologies;
        delete plan.updatedOn;
        delete plan.status;
        delete plan.businessUnitId;
        delete plan.businessUnitName;
        delete plan.providerCode;
        delete plan.config;
        return plan;
      });
      return plans;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PlanManager getPlans took ${(_timeEnd[0] * NS_PER_SEC + _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get plan details for specified business unit.
   *
   * @param {object} params
   * {
   *    @param {string} planCode(required)  The plan code to check for.
   *    @param {object} businessUnit(required)  The business unit to retrieve plans for.
   * }
   */
  async getPlanDetails(params = {}) {
    logger.info("PlanManager getPlanDetails");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.businessUnit === "undefined" ||
      typeof params.planCode === "undefined"
    ) {
      throw genericError({
        message:
          "Get plans failed due to: Required businessUnit and/or planCode are missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT * FROM plans WHERE plans.planCode = ? AND plans.businessUnitId = ?`;
      const values = [params.planCode, params.businessUnit.businessUnitId];
      let response = await connection.query(query, values);
      let plan = response[0][0];
      if (!plan) {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10029,
              message: ERROR_CODES[10029]
            }
          ]
        });
      }
      plan.active = !!plan.status;
      plan.broadsoft = JSON.parse(plan.broadsoft || null);
      plan.ipswitch = JSON.parse(plan.ipswitch || null);
      plan.huawei = JSON.parse(plan.huawei || null);
      plan.nextologies = JSON.parse(plan.nextologies || null);
      plan.allotment = JSON.parse(plan.allotment || null);

      delete plan.usage;
      delete plan.status;
      delete plan.businessUnitId;
      delete plan.businessUnitName;
      delete plan.providerCode;
      delete plan.config;
      delete plan.businessUnitId;
      return plan;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PlanManager getPlanDetails took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Create plan
   *
   * @param {object} params
   * {
   *    @param {string} planCode (required)
   *    @param {string} billingType (required)
   *    @param {string} recurringCharge (required)
   *    @param {boolean} billable (required)
   *    @param {string} flatRateTariff(required)
   *    @param {string} planType(required)
   *    @param {boolean} active (optional) default is true
   *    @param {Object} allotment (optional)
   *    @param {Object} broadsoft (optional)
   *    @param {Object} ipswitch (optional)
   *    @param {Object} huawei (optional)
   *    @param {Object} nextologies (optional)
   *    @param {string} businessUnitId(required) Business Unit ID
   * }
   */
  async createPlan(params = {}) {
    logger.info("PlanManager createPlan");
    const _timeStart = process.hrtime();

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT count(*) as count FROM plans WHERE planCode = ? AND businessUnitId = ?`;
      let values = [params.planCode, params.businessUnitId];
      let response = await connection.query(query, values);
      if (response[0][0].count > 0) {
        throw genericError({
          message: `Create Plan failed due to planCode must be unique: ${params.planCode}`,
          status: 400,
          code: 400
        });
      }

      query = `INSERT INTO plans (planCode, planType, flatRateTariff, billingType, businessUnitId, status, billable, recurringCharge, broadsoft, ipswitch, huawei, nextologies, allotment) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      values = [
        params.planCode,
        params.planType,
        params.flatRateTariff,
        params.billingType,
        params.businessUnitId,
        !!params.active ? 1 : 0,
        !!params.billable ? 1 : 0,
        params.recurringCharge,
        JSON.stringify(params.broadsoft) || null,
        JSON.stringify(params.ipswitch) || null,
        JSON.stringify(params.huawei) || null,
        JSON.stringify(params.nextologies) || null,
        JSON.stringify(params.allotment) || null
      ];
      response = await connection.query(query, values);
      return this.getPlanDetails({
        planCode: params.planCode,
        businessUnit: {
          businessUnitId: params.businessUnitId
        }
      });
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PlanManager createPlan took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update plan
   *
   * @param {object} params
   * {
   *    @param {string} planCode (required)
   *    @param {string} billingType (optional)
   *    @param {string} recurringCharge (optional)
   *    @param {boolean} billable (optional)
   *    @param {string} flatRateTariff(optional)
   *    @param {string} planType(optional)
   *    @param {boolean} active (optional)
   *    @param {Object} allotment (optional)
   *    @param {Object} broadsoft (optional)
   *    @param {Object} ipswitch (optional)
   *    @param {Object} huawei (optional)
   *    @param {Object} nextologies (optional)
   *    @param {string} businessUnitId(required) Business Unit ID
   * }
   */
  async updatePlan(params = {}) {
    logger.info("PlanManager updatePlan");
    const _timeStart = process.hrtime();

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT planCode FROM plans WHERE planCode = ? AND businessUnitId = ?`;
      let values = [params.planCode, params.businessUnitId];
      let response = await connection.query(query, values);
      if (response[0].length === 0) {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 7017,
              message: ERROR_CODES[7017]
            }
          ]
        });
      }

      values = [params.planCode];
      query = `UPDATE plans SET planCode = ?`;

      if (params.planType) {
        query += ", planType = ? ";
        values.push(params.planType);
      }
      if (params.flatRateTariff) {
        query += ", flatRateTariff = ? ";
        values.push(params.flatRateTariff);
      }
      if (params.billingType) {
        query += ", billingType = ? ";
        values.push(params.billingType);
      }
      if (params.active !== undefined) {
        query += ", status = ? ";
        values.push(!!params.active ? 1 : 0);
      }
      if (params.active !== undefined) {
        query += ", billable = ? ";
        values.push(!!params.billable ? 1 : 0);
      }
      if (params.broadsoft) {
        query += ", broadsoft = ? ";
        values.push(JSON.stringify(params.broadsoft));
      }
      if (params.ipswitch) {
        query += ", ipswitch = ? ";
        values.push(JSON.stringify(params.ipswitch));
      }
      if (params.huawei) {
        query += ", huawei = ? ";
        values.push(JSON.stringify(params.huawei));
      }
      if (params.nextologies) {
        query += ", nextologies = ? ";
        values.push(JSON.stringify(params.nextologies));
      }
      if (params.allotment) {
        query += ", allotment = ? ";
        values.push(
          params.allotment === null ? null : JSON.stringify(params.allotment)
        );
      }
      query += " where planCode = ? AND businessUnitId = ?";
      values.push(params.planCode, params.businessUnitId);

      response = await connection.query(query, values);
      if (response[0].affectedRows) {
        return this.getPlanDetails({
          planCode: params.planCode,
          businessUnit: {
            businessUnitId: params.businessUnitId
          }
        });
      } else {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 7017,
              message: ERROR_CODES[7017]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PlanManager updatePlan took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Delete plan
   *
   * @param {object} params
   * {
   *    @param {string} planCode (required)
   *    @param {string} businessUnitId(required) Business Unit ID
   * }
   */
  async deletePlan(params = {}) {
    logger.info("PlanManager deletePlan");
    const _timeStart = process.hrtime();

    let connection = null;
    try {
      connection = await db.getIristelXConnection();

      let query = `SELECT COUNT(*) as count FROM serviceAccounts AS sa JOIN 
      masterAccounts AS ma ON ma.id = sa.masterAccount WHERE ma.businessUnitId = ? AND sa.planCode = ?`;

      const values = [params.businessUnitId, params.planCode];

      let response = await connection.query(query, values);
      if (response[0][0].count > 0) {
        throw genericError({
          status: 400,
          code: 400,
          errors: [
            {
              code: 7019,
              message: ERROR_CODES[7019]
            }
          ]
        });
      }

      query = "DELETE FROM plans WHERE businessUnitId = ? AND planCode = ?";

      response = await connection.query(query, values);
      if (response[0].affectedRows === 0) {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 7018,
              message: ERROR_CODES[7018]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PlanManager deletePlan took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
