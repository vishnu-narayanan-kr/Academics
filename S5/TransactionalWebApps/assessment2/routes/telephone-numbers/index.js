"use strict";
const express = require("express");
const router = express.Router();
const logger = require("./../../logger")(module);
const { validationError } = require("./../../utils/error");
const { telephoneNumberManager } = require("./../../managers");
const validators = require("./../../utils/validators/telephone-number-route-validators");
const format = require("date-fns/format");

/**
 * GET available telephone numbers
 *
 * Request query strings
 * @param {string} city(optional)  The city or cities (comma-delimited) to find numbers for.
 * @param {string} province(optional)  The province or provinces (comma-delimited)  to find numbers for.
 * @param {string} country(optional)  The country to find numbers for.
 * @param {string} areaCode(optional)  Find numbers matching the provided areaCode or areaCodes (comma-delimited).
 * @param {string} exchangeCode(optional)  Find numbers matching the provided exchangeCode or exchangeCodes (comma-delimited).
 * @param {string} lineNumber(optional)  Find numbers matching the provided lineNumber.
 */
router.get("/catalogue", async (req, res, next) => {
  logger.info("GET:  get catalogue");
  req.checkQuery(validators.get.catalogue);
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
      const numbers = await telephoneNumberManager.getCatalogue(params);
      return res.json(numbers);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});
/**
 * GET reserved telephone numbers
 *
 * Request query strings
 * @param {boolean} inUse(optional) If true returns reserved telephone numbers that are in use by services.
 *          If false returns reserved telephone numbers that are not in use by services. If not provided,
 *          returns telephone numbers both in use and not in use by services.
 * @param {boolean} checkLastUsed(optional) If true, validate against 90 day rule of last used.
 * @param {string} lastUsed(optional) In format YYYY-MM-DD.
 * @param {string} city(optional)  The city or cities (comma-delimited) to find numbers for.
 * @param {string} province(optional)  The province or provinces (comma-delimited)  to find numbers for.
 * @param {string} country(optional)  The country to find numbers for.
 * @param {string} areaCode(optional)  Find numbers matching the provided areaCode or areaCodes (comma-delimited).
 * @param {string} exchangeCode(optional)  Find numbers matching the provided exchangeCode or exchangeCodes (comma-delimited).
 * @param {string} lineNumber(optional)  Find numbers matching the provided lineNumber.
 * @param {string} fullNumber(optional)  Find numbers matching the provided fullNumber.
 * @param {string} lastUsed(optional) In format YYYY-MM-DD.
 * @param {number} page(optional) Defaults to 1.
 * @param {number} pageLimit(optional) Defaults to 10.
 */
router.get("/reserved", async (req, res, next) => {
  logger.info("GET:  reserved telephone numbers");
  req.checkQuery(validators.get.catalogue);
  if (
    (typeof req.query.lat !== "undefined" &&
      typeof req.query.lng === "undefined") ||
    (typeof req.query.lng !== "undefined" &&
      typeof req.query.lat === "undefined")
  ) {
    req._validationErrors.push({
      param: "lat/lng",
      msg: "5024",
      location: "query",
      value: `${req.query.lat}  ${req.query.lng}`
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
    const params = Object.assign(req.query || {}, {
      businessUnitId: req._businessUnit.businessUnitId
    });
    try {
      params.inUse =
        typeof params.inUse !== "undefined"
          ? params.inUse.toLowerCase() === "true"
          : undefined;
      params.checkLastUsed =
        typeof params.checkLastUsed !== "undefined"
          ? params.checkLastUsed.toLowerCase() === "true"
          : undefined;
      const data = await telephoneNumberManager.getReservedNumbers(params);
      const telephoneNumbers = data.numbers.map(number => {
        return {
          telephoneNumber: number.fullNumber,
          serviceId: number.serviceId,
          city: number.city,
          province: number.province,
          country: number.country,
          areaCode: number.areaCode,
          exchangeCode: number.exchangeCode,
          geo_code: {
            lat: number.lat,
            lng: number.lng
          },
          lineNumber: number.lineNumber,
          inUse: !!number.serviceId,
          lastUsed:
            (number.lastUsed && format(number.lastUsed, "YYYY-MM-DD")) || null
        };
      });
      delete data.numbers;
      return res.json(
        Object.assign(data, {
          telephoneNumbers
        })
      );
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});
/**
 * POST reserve telephone numbers
 *
 * Request body object
 *  @param {array} telephoneNumbers(required)
 */
router.post("/reserve", async (req, res, next) => {
  logger.info("POST:  reserve telephone numbers");
  req.checkBody(validators.post.telephoneNumbers);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const numbers = await telephoneNumberManager.reserveNumbers({
        telephoneNumbers: req.body.telephoneNumbers,
        businessUnitId: req._businessUnit.businessUnitId
      });
      return res.json(numbers);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});
/**
 * POST Release telephone number
 *
 * Request param strings
 * @param {string} telephoneNumber(required)  The telephone number to release.
 */
router.post("/release/:telephoneNumber", async (req, res, next) => {
  logger.info("DELETE:  release telephone number");
  try {
    const result = await telephoneNumberManager.releaseNumber({
      telephoneNumber: req.params.telephoneNumber,
      businessUnitId: req._businessUnit.businessUnitId
    });
    return res.json(result);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

module.exports = router;
