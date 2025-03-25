"use strict";

const debug = require("debug")("manager:webhook");
const debugTiming = require("debug")("timing");
const crypto = require("crypto");
const shortUUID = require("short-uuid");
const request = require("request-promise-native");
const db = require("./../../database");
const logger = require("./../../logger")(module);
const { genericError } = require("./../../utils/error");
const { NS_PER_SEC } = require("./../../utils/constants");

/**
 * Class that handles any/all functionality related to webhooks.
 */
module.exports = {
  /**
   * Retrieve supported webhook events
   *
   * Request param strings
   *
   * @param {object} params
   * {
   * }
   */
  async getWebhookEvents(params = {}) {
    logger.info("WebhookManager getWebhookEvents");
    const _timeStart = process.hrtime();
    let connection = null;
    try {
      const query = `SELECT event, description FROM platformEvents WHERE enabled = 1`;
      connection = await db.getIristelXConnection();
      const response = await connection.query(query);
      // const platformEvents = {};
      // (response[0] || []).forEach(pe => {
      //   platformEvents[pe.event] = {
      //     description: pe.description
      //   };
      // });
      // return platformEvents;
      return {
        events: response[0]
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `WebhookManager getWebhookEvents took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Retrieve a specific webhook
   *
   * Request param strings
   *
   * @param {object} params
   * {
   *    @param {string} webhookId(required)  The id of the webhook to retrieve.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getWebhook(params = {}) {
    logger.info("WebhookManager getWebhook");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.webhookId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Get Webhook failed due to: One of required webhookId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      const query = `SELECT id, target_url, event FROM webhooks WHERE id = ? AND apiId = ? AND businessUnitId = ?`;
      const values = [
        params.webhookId,
        params.businessUnit.apiId,
        params.businessUnit.businessUnitId
      ];
      connection = await db.getIristelXConnection();
      const response = await connection.query(query, values);
      if (response[0].length === 0) {
        throw genericError({
          message: `Get Webhook ${params.webhookId} not found.`,
          status: 404,
          code: 404
        });
      }
      return response[0][0];
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `WebhookManager getWebhook took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Retrieve all webhooks associated with the account
   *
   * @param {object} params
   * {
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async getWebhooks(params = {}) {
    logger.info("WebhookManager getWebhooks");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnit === "undefined") {
      throw genericError({
        message:
          "Get Webhooks failed due to: Required businessUnit is missing.",
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      const query = `SELECT id, target_url, event FROM webhooks WHERE apiId = ? AND businessUnitId = ?`;
      const values = [
        params.businessUnit.apiId,
        params.businessUnit.businessUnitId
      ];
      connection = await db.getIristelXConnection();
      const response = await connection.query(query, values);
      return response[0];
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `WebhookManager getWebhooks took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Create webhook
   *
   * @param {object} params
   * {
   *    @param {string} target_url(required) The target_url to POST the details of the platform event.
   *    @param {string} event(required) The platform event to create a webhook for.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async createWebhook(params = {}) {
    logger.info("WebhookManager createWebhook");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.target_url === "undefined" ||
      typeof params.event === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Create Webhook failed due to: One of required target_url, event and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT count(*) as count FROM platformEvents WHERE event = ? AND enabled = 1`;
      let values = [params.event];
      let response = await connection.query(query, values);
      if (response[0][0].count === 0) {
        throw genericError({
          message: `Create Webhook failed due to invalid webhook event: ${params.event}`,
          status: 400,
          code: 400
        });
      }
      const secret = crypto.randomBytes(16).toString("hex");
      const options = {
        url: params.target_url,
        method: "POST",
        simple: false,
        resolveWithFullResponse: true,
        headers: {
          "X-Hook-Secret": secret
        }
      };
      try {
        const webhookResponse = await request(options);
        if (
          webhookResponse.statusCode !== 200 ||
          webhookResponse.headers["x-hook-secret"] !== secret
        ) {
          throw new Error(
            "Create Webhook failed due to target_url not responding with proper secret header and/or status code."
          );
        }
      } catch (e) {
        throw genericError({
          message: `Create Webhook failed due to target_url not responding with proper secret header and/or status code.`,
          status: 400,
          code: 400
        });
      }

      const id = shortUUID.generate();
      query = `INSERT INTO webhooks (id, target_url, event, apiId, businessUnitId, confirmed, secret) VALUES (?,?,?,?,?,?,?)`;
      values = [
        id,
        params.target_url,
        params.event,
        params.businessUnit.apiId,
        params.businessUnit.businessUnitId,
        1,
        secret
      ];
      response = await connection.query(query, values);
      return {
        id,
        target_url: params.target_url,
        event: params.event
      };
    } catch (e) {
      logger.error(e);
      //TODO: re-visit...might support duplicate urls
      if (e.errno === 1062) {
        //Duplicate target_url
        throw genericError({
          message: `Create Webhook failed due to: ${e.message}.`,
          status: 409,
          code: 409
        });
      }
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `WebhookManager createWebhook took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update webhook
   *
   * @param {object} params
   * {
   *    @param {string} webhookId(required)  The webhook id to update.
   *    @param {string} target_url(optional) The target_url.
   *    @param {string} event(opitonal) The platform event.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async updateWebhook(params = {}) {
    logger.info("WebhookManager updateWebhook");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.webhookId === "undefined" ||
      (typeof params.target_url === "undefined" &&
        typeof params.event === "undefined") ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Update Webhook failed due to: One of required webhookId, (target_url or event), and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      if (params.event) {
        connection = await db.getIristelXConnection();
        let query = `SELECT count(*) as count FROM platformEvents WHERE event = ? AND enabled = 1`;
        let values = [params.event];
        let response = await connection.query(query, values);
        if (response[0][0].count === 0) {
          throw genericError({
            message: `Create Webhook failed due to invalid webhook event: ${params.event}`,
            status: 400,
            code: 400
          });
        }
      }
      const secret = crypto.randomBytes(16).toString("hex");
      if (params.target_url) {
        try {
          const options = {
            url: params.target_url,
            method: "POST",
            simple: false,
            resolveWithFullResponse: true,
            headers: {
              "X-Hook-Secret": secret
            }
          };
          const webhookResponse = await request(options);
          if (
            webhookResponse.statusCode !== 200 ||
            webhookResponse.headers["x-hook-secret"] !== secret
          ) {
            throw new Error(
              "Create Webhook failed due to target_url not responding with proper secret header and/or status code."
            );
          }
        } catch (e) {
          throw genericError({
            message: `Create Webhook failed due to target_url not responding with proper secret header and/or status code.`,
            status: 400,
            code: 400
          });
        }
      }
      let values = [];
      let query = `UPDATE webhooks SET`;
      if (params.target_url) {
        query += ` target_url = ?, confirmed = ?, secret = ?`;
        values.push(params.target_url, 1, secret);
      }
      if (params.event) {
        if (params.target_url) {
          query += ` ,`;
        }
        query += ` event = ?`;
        values.push(params.event);
      }
      query += ` WHERE id = ? AND apiId = ? AND businessUnitId = ?`;
      values.push(
        params.webhookId,
        params.businessUnit.apiId,
        params.businessUnit.businessUnitId
      );
      const response = await connection.query(query, values);
      if (response[0].affectedRows) {
        return {
          id: params.webhookId,
          event: params.event,
          target_url: params.target_url
        };
      } else {
        throw genericError({
          message: `Update Webhook ${params.webhookId} failed due to invalid permission or does not exist.`,
          status: 403,
          code: 403
        });
      }
    } catch (e) {
      logger.error(e);
      if (e.errno === 1062) {
        //Duplicate target_url
        throw genericError({
          message: `Update Webhook ${params.webhookId} failed due to: ${e.message}.`,
          status: 409,
          code: 409
        });
      }
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `WebhookManager updateWebhook took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Delete webhook
   *
   * @param {object} params
   * {
   *    @param {string} webhookId(required)  The webhook id to delete.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async deleteWebhook(params = {}) {
    logger.info("WebhookManager deleteWebhook");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.webhookId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Delete Webhook failed due to: One of required webhookId and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      const query = `DELETE FROM webhooks WHERE id = ? AND apiId = ? AND businessUnitId = ?`;
      const values = [
        params.webhookId,
        params.businessUnit.apiId,
        params.businessUnit.businessUnitId
      ];
      connection = await db.getIristelXConnection();
      const response = await connection.query(query, values);
      if (response[0].affectedRows) {
        return {
          id: params.webhookId
        };
      } else {
        throw genericError({
          message: `Delete Webhook ${params.webhookId} failed due to invalid permission or does not exist.`,
          status: 403,
          code: 403
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `WebhookManager deleteWebhook took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
