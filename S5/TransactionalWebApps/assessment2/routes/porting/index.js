"use strict";
const express = require("express");
const router = express.Router();
const logger = require("./../../logger")(module);
const { validationError, genericError } = require("./../../utils/error");
const { accountManager, portingManager } = require("./../../managers");
const validators = require("./../../utils/validators/porting-route-validators");

/**
 * GET check if NPA-NXX can be portable
 *
 * Request query strings
 * @param {string} areaCode(required)  Find numbers matching the provided areaCode. Excluding the country code, the
 *    first 3 digits of the telephone number.
 * @param {string} exchangeCode(required)  Find numbers matching the provided exchangeCode. The 3 digits of the
 *    telephone number following the area code.
 */
router.get("/check", async (req, res, next) => {
  const npa = req.query.areaCode;
  const nxx = req.query.exchangeCode;
  const npanxx = `${npa}${nxx}`;
  logger.info(`GET:  check portability for NPA-NXX #${npanxx}`);
  req.checkQuery(validators.get.check);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const data = await portingManager.checkPortability({
        npanxx,
        businessUnit: req._businessUnit
      });
      return res.json(
        Object.assign(data, {
          areaCode: req.query.areaCode,
          exchangeCode: req.query.exchangeCode
        })
      );
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * GET get all porting requests' details
 *
 * Request query strings
 * @param {string} serviceId(optional) Filter by serviceId.
 * @param {string} accountId(optional) Filter by accountId.
 * @param {string} telephoneNumber(optional) Filter by telephoneNumber.
 * @param {string} requestDate(optional) Filter by requestDate. Format: YYYY-MM-DD
 * @param {stirng} desiredDueDate(optional) Filter by desiredDueDate. Format: YYYY-MM-DD
 */
router.get("/", async (req, res, next) => {
  logger.info(`GET:  all porting request details`);
  req.checkQuery(validators.get.requests);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const data = await portingManager.getPortRequests(
        Object.assign({}, req.query, {
          businessUnit: req._businessUnit
        })
      );
      return res.json(data);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * GET get porting request details
 *
 * Request param strings
 * @param {string} requestId(required)  The request id to retrieve info for.
 */
router.get("/:requestId", async (req, res, next) => {
  const requestId = req.params.requestId;
  logger.info(`GET:  porting request details for #${requestId}`);
  try {
    const data = await portingManager.getPortRequests({
      requestId,
      businessUnit: req._businessUnit
    });
    return res.json(data);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * POST create porting request
 *
 * Request body object
 * @param {string} telephoneNumber(required)  The telephone number to be transferred from the existing provider (losing carrier).
 * @param {string} providerName(required)  The Provider that currently hosts the Telephone Number that the Account Holder wishes to Port-In. This is also known as the losing carrier.
 * @param {string} providerAccountNumber(required)  The Account Number associated with the existing provider and telephone number that is to be ported-in.
 *    This must match the existing provider's records or the transfer request will be rejected.
 * @param {String} desiredDueDate(required)  The date the account holder is requesting for the transfer to take effect. Format: YYYY-MM-DD
 * @param {string} serviceType(required)  The type of service for the phone number being transferred.
 * @param {string} fullName(required)  The full name of the account holder. This must match the current provider's records.
 * @param {string} streetNumber(required)  The street number of the account holder. This must match the current provider's records.
 * @param {string} streetName(required)  The street name of the account holder. This must match the current provider's records.
 * @param {string} unitNumber(optional)  If applicable, the unit number of the account holder. This must match the current provider's records.
 * @param {string} city(required)  The city of the account holder. This must match the current provider's records.
 * @param {string} province(required)  The province of the account holder. This must match the current provider's records.
 * @param {string} postalCode(required)  The postal code of the account holder. This must match the current provider's records.
 * @param {string} comments(optional)  Comments or special instructions related to this transfer request may be entered.
 * @param {string} serviceId(required)  The serviceId that the telephone number will be assigned to when the transfer is complete.
 */
router.post("/", async (req, res, next) => {
  logger.info("POST:  create porting request");
  req.checkBody(validators.post.request);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  }
  const service = await accountManager.getServiceAccount({
    serviceId: req.body.serviceId,
    businessUnit: req._businessUnit
  });
  if (
    !service.length ||
    (service.length &&
      ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
        service[0].status.toUpperCase()
      ) === -1)
  ) {
    return next(
      genericError({
        message: `Service ID: ${req.body.serviceId} either does not exist or is not in one of 'NEW', 'ACTIVE', or 'SUSPENDED' status.`,
        status: 400,
        code: 400,
        type: "GenericError",
        errors: []
      })
    );
  }
  try {
    const data = await portingManager.createPortRequest(
      Object.assign({}, req.body, {
        businessUnit: req._businessUnit
      })
    );
    return res.json(data);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

// for testing purposes only
// router.patch("/status/:requestId", async (req, res, next) => {
//   const requestId = req.params.requestId;
//   logger.info(`PATCH:  update porting status for request #${requestId}`);
//   try {
//     const data = await portingManager.updatePortRequestStatus({
//       requestId,
//       status: req.body.status,
//       businessUnit: req._businessUnit
//     });
//     return res.json(data);
//   } catch (e) {
//     logger.error(e);
//     return next(e);
//   }
// });

/**
 * PATCH update porting request
 *
 * Request param strings
 * @param {string} requestId(required)  The request id to update info for.
 *
 * Request body object
 * @param {string} providerName(optional)  The Provider that currently hosts the Telephone Number that the Account Holder wishes to Port-In. This is also known as the losing carrier.
 * @param {string} providerAccountNumber(optional)  The Account Number associated with the existing provider and telephone number that is to be ported-in.
 *    This must match the existing provider's records or the transfer request will be rejected.
 * @param {string} desiredDueDate(optional)  The date the account holder is requesting for the transfer to take effect. Format: YYYY-MM-DD
 * @param {string} serviceType(optional)  The type of service for the phone number being transferred.
 * @param {string} fullName(optional)  The full name of the account holder. This must match the current provider's records.
 * @param {string} streetNumber(optional)  The street number of the account holder. This must match the current provider's records.
 * @param {string} streetName(optional)  The street name of the account holder. This must match the current provider's records.
 * @param {string} unitNumber(optional)  If applicable, the unit number of the account holder. This must match the current provider's records.
 * @param {string} city(optional)  The city of the account holder. This must match the current provider's records.
 * @param {string} province(optional)  The province of the account holder. This must match the current provider's records.
 * @param {string} postalCode(optional)  The postal code of the account holder. This must match the current provider's records.
 * @param {string} comments(optional)  Comments or special instructions related to this transfer request may be entered.
 * @param {string} serviceId(optional)  The serviceId that the telephone number will be assigned to when the transfer is complete.
 */
router.patch("/:requestId", async (req, res, next) => {
  const requestId = req.params.requestId;
  logger.info(`PATCH:  update porting request #${requestId}`);
  req.checkBody(validators.patch.request);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  }
  if (req.body.serviceId) {
    const service = await accountManager.getServiceAccount({
      serviceId: req.body.serviceId,
      businessUnit: req._businessUnit
    });
    if (
      !service.length ||
      (service.length &&
        ["NEW", "ACTIVE", "SUSPENDED"].indexOf(
          service[0].status.toUpperCase()
        ) === -1)
    ) {
      return next(
        genericError({
          message: `Service ID: ${req.body.serviceId} either does not exist or is not in one of 'NEW', 'ACTIVE', or 'SUSPENDED' status.`,
          status: 400,
          code: 400,
          type: "GenericError",
          errors: []
        })
      );
    }
  }
  try {
    const data = await portingManager.updatePortRequest(
      Object.assign({}, req.body, {
        requestId,
        businessUnit: req._businessUnit
      })
    );
    return res.json(data);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * DELETE cancel porting request
 *
 * Request param strings
 * @param {string} requestId(required)  The request id to cancel.
 */
router.delete("/:requestId", async (req, res, next) => {
  const requestId = req.params.requestId;
  logger.info(`PATCH:  delete porting request #${requestId}`);
  try {
    const data = await portingManager.cancelPortRequest({
      requestId,
      businessUnit: req._businessUnit
    });
    return res.json(data);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

module.exports = router;
