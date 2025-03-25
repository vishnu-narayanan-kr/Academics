"use strict";
const express = require("express");
const router = express.Router();
const { planManager } = require("./../../managers");
const logger = require("./../../logger")(module);
const validators = require("./../../utils/validators/plan-route-validator");
const { validationError } = require("./../../utils/error");
/**
 * GET available plans
 * Request query strings
 * @param {string} billingTypes(optional)  Comma-delimited billing types string.
 * @param {number} status(optional) Status number string. 1/0
 */
router.get("/", async (req, res, next) => {
  logger.info(`GET:  get available plans`);
  try {
    const billingTypes =
      (req.query.billingTypes && req.query.billingTypes.split(",")) || null;
    let status = parseInt(req.query.status);
    status = isNaN(status) ? null : status;
    const plans = await planManager.getPlans({
      billingTypes,
      status,
      businessUnit: req._businessUnit
    });
    const data = {
      plans
    };
    return res.json(data);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});
/**
 * GET available plans
 * Request parameter string
 * @param {string} planCode(required)  The plan to retrieve.
 */
router.get("/:planCode", async (req, res, next) => {
  logger.info(`GET:  get plan ${req.params.planCode}`);
  try {
    const plan = await planManager.getPlanDetails({
      planCode: req.params.planCode,
      businessUnit: req._businessUnit
    });
    return res.json(plan);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * POST plan
 *
 * Request body object
 * @param {string} planCode (required)
 * @param {string} billingType (required)
 * @param {string} recurringCharge (required)
 * @param {boolean} billable (required)
 * @param {string} flatRateTariff(required)
 * @param {string} planType(required)
 *
 * @param {boolean} active (optional) default is true
 * @param {Object} allotment (optional)
 * @param {Object} broadsoft (optional)
 * @param {Object} ipswitch (optional)
 * @param {Object} huawei (optional)
 * @param {Object} nextologies (optional)
 */
router.post("/", async (req, res, next) => {
  logger.info(`POST: plan`);

  req.checkBody(validators.post.plan);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const result = await planManager.createPlan({
        planCode: req.body.planCode,
        billingType: req.body.billingType,
        recurringCharge: req.body.recurringCharge,
        billable: req.body.billable,
        active: req.body.active,
        flatRateTariff: req.body.flatRateTariff,
        planType: req.body.planType,
        allotment: req.body.allotment,
        broadsoft: req.body.broadsoft,
        ipswitch: req.body.ipswitch,
        huawei: req.body.huawei,
        nextologies: req.body.nextologies,
        businessUnitId: req._businessUnit.businessUnitId
      });
      return res.json(result);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * PATCH plan
 *
 * Request param strings
 * @param {string} planCode(required)  The planeCode of the plan to update.
 *
 * Request body object
 * @param {string} billingType (optional)
 * @param {string} recurringCharge (optional)
 * @param {boolean} billable (optional)
 * @param {string} flatRateTariff(optional)
 * @param {string} planType(optional)
 * @param {boolean} active (optional)
 * @param {Object} allotment (optional)
 * @param {Object} broadsoft (optional)
 * @param {Object} ipswitch (optional)
 * @param {Object} huawei (optional)
 * @param {Object} nextologies (optional)
 */
router.patch("/:planCode", async (req, res, next) => {
  logger.info(`PATCH: plan code ${req.params.planCode}`);

  req.checkBody(validators.patch.plan);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const result = await planManager.updatePlan({
        planCode: req.params.planCode,
        billingType: req.body.billingType,
        recurringCharge: req.body.recurringCharge,
        billable: req.body.billable,
        active: req.body.active,
        flatRateTariff: req.body.flatRateTariff,
        planType: req.body.planType,
        allotment: req.body.allotment,
        broadsoft: req.body.broadsoft,
        ipswitch: req.body.ipswitch,
        huawei: req.body.huawei,
        nextologies: req.body.nextologies,
        businessUnitId: req._businessUnit.businessUnitId
      });
      return res.json(result);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * DELETE plan
 *
 * Request param strings
 * @param {string} planCode(required)  The planeCode of the plan to delete.
 *
 */
router.delete("/:planCode", async (req, res, next) => {
  logger.info(`DELETE: plan code ${req.params.planCode}`);
  try {
    await planManager.deletePlan({
      planCode: req.params.planCode,
      businessUnitId: req._businessUnit.businessUnitId
    });
    return res.json({});
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

module.exports = router;
