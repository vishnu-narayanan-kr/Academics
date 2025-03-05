"use strict";
const express = require("express");
const router = express.Router();
const logger = require("./../../logger")(module);
const { validationError } = require("./../../utils/error");
const { simCardManager } = require("./../../managers");
const validators = require("./../../utils/validators/sim-card-route-validators");

/**
 * GET SIM cards
 *
 * Request query strings
 * @param {string} iccid(optional)  The iccid to find sim card(s) for.
 * @param {string} imsi(optional)  The imsi to find sim card(s)for.
 * @param {string} puk(optional)  The puk to find sim card(s) for.
 * @param {string} udf1(optional)  The udf1 to find sim card(s) for.
 * @param {string} udf2(optional)  The udf2 to find sim card(s) for.
 * @param {string} udf3(optional)  The udf3 to find sim card(s) for.
 */
router.get("/", async (req, res, next) => {
  logger.info("GET:  SIM cards");
  req.checkQuery(validators.get.simcards);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    const params = Object.assign({}, req.query);
    params.businessUnitId = req._businessUnit.businessUnitId;
    try {
      const simCards = await simCardManager.getSIMCards(params);
      return res.json({
        simCards
      });
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});
/**
 * GET SIM card
 *
 */
router.get("/:iccid", async (req, res, next) => {
  const iccid = req.params.iccid;
  logger.info(`GET:  SIM card: ${iccid}`);
  try {
    const simcard = await simCardManager.getSIMCard({
      iccid,
      businessUnitId: req._businessUnit.businessUnitId
    });
    return res.json(simcard);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});
module.exports = router;
