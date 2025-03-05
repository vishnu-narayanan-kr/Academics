"use strict";
const express = require("express");
const router = express.Router();
const { webhookManager } = require("../../managers");
const validators = require("../../utils/validators/webhook-route-validators");
const logger = require("./../../logger")(module);
const { validationError } = require("./../../utils/error");

/**
 * GET webhook events
 *
 */
router.get("/events", async (req, res, next) => {
  logger.info(`GET:  webhook events`);
  try {
    const result = await webhookManager.getWebhookEvents({});
    return res.json(result);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * GET webhook
 *
 * Request param strings
 * @param {string} webhookId(required)  The id of the webhook to retrieve.
 *
 */
router.get("/:webhookId", async (req, res, next) => {
  logger.info(`GET:  webhook ${req.params.webhookId}`);
  try {
    const result = await webhookManager.getWebhook({
      webhookId: req.params.webhookId,
      businessUnit: req._businessUnit
    });
    return res.json(result);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * GET webhooks
 *
 */
router.get("/", async (req, res, next) => {
  logger.info(`GET:  webhooks`);
  try {
    const result = await webhookManager.getWebhooks({
      businessUnit: req._businessUnit
    });
    return res.json(result);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * POST webhook
 *
 * Request body object
 * @param {string} target_url(required) The target_url to POST the details of the platform event.
 * @param {string} event(required) The platform event to create a webhook for.
 */
router.post("/", async (req, res, next) => {
  logger.info(`POST:  webhooks`);
  req.checkBody(validators.post.webhook);
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const result = await webhookManager.createWebhook({
        target_url: req.body.target_url,
        event: req.body.event,
        businessUnit: req._businessUnit
      });
      return res.status(201).json(result);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * PATCH webhook
 *
 * Request param strings
 * @param {string} webhookId(required)  The id of the webhook to update.
 *
 * Request body object
 * @param {string} target_url(optional) The updated URL to POST the details of the platform event.
 * @param {string} event(optional) The updated platform event.
 */
router.patch("/:webhookId", async (req, res, next) => {
  logger.info(`PATCH:  webhook id ${req.params.webhookId}`);
  req.checkBody(validators.put.webhook);
  const result = await req.getValidationResult();
  if (!req.body.target_url && !req.body.event) {
    req._validationErrors.push({
      param: "target_url/event",
      msg: "6008",
      location: "body",
      value: ""
    });
  }
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const result = await webhookManager.updateWebhook({
        webhookId: req.params.webhookId,
        target_url: req.body.target_url,
        event: req.body.event,
        businessUnit: req._businessUnit
      });
      return res.json(result);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * PUT webhook
 *
 * Request param strings
 * @param {string} webhookId(required)  The id of the webhook to update.
 *
 * Request body object
 * @param {string} target_url(optional) The updated URL to POST the details of the platform event.
 * @param {string} event(optional) The updated platform event.
 */
router.put("/:webhookId", async (req, res, next) => {
  logger.info(`PUT:  webhook id ${req.params.webhookId}`);
  req.checkBody(validators.put.webhook);
  const result = await req.getValidationResult();
  if (!req.body.target_url && !req.body.event) {
    req._validationErrors.push({
      param: "target_url/event",
      msg: "6008",
      location: "body",
      value: ""
    });
  }
  if (!result.isEmpty()) {
    return next(
      validationError({
        errors: result.array()
      })
    );
  } else {
    try {
      const result = await webhookManager.updateWebhook({
        webhookId: req.params.webhookId,
        target_url: req.body.target_url,
        event: req.body.event,
        businessUnit: req._businessUnit
      });
      return res.json(result);
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  }
});

/**
 * DELETE webhook
 *
 * Request param strings
 * @param {string} webhookId(required)  The id of the webhook to delete.
 *
 */
router.delete("/:webhookId", async (req, res, next) => {
  logger.info(`DELETE:  webhook ${req.params.webhookId}`);
  try {
    const result = await webhookManager.deleteWebhook({
      webhookId: req.params.webhookId,
      businessUnit: req._businessUnit
    });
    return res.json(result);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

module.exports = router;
