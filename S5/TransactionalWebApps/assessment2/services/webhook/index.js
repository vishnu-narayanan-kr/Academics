"use strict";

const debug = require("debug")("service:webhook");
const db = require("./../../database");
const logger = require("./../../logger")(module);
const { genericError } = require("./../../utils/error");
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION
});
const SQS = new AWS.SQS({
  apiVersion: "2012-11-05"
});

/**
 * Class that handles any/all functionality related to webhooks.
 */
module.exports = {
  /**
   * Send a webhook.
   *
   * @param {object} params
   * {
   *    @param {boolean} event(required) Webhook event name.
   *    @param {string} payload(required) The payload to send to the webhook
   *    @param {object} businessUnit(required)  The business unit to retrieve plans for.
   * }
   */
  async send(params = {}) {
    logger.info("Webhook Service send");
    if (
      !params ||
      typeof params.event === "undefined" ||
      typeof params.payload === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Webhook Service send failed due to: One of required event, payload, and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      const query = `SELECT w.*, aa.enabled FROM webhooks AS w LEFT JOIN apiAccounts AS aa ON aa.apiId = w.apiId WHERE aa.enabled = 1 AND w.businessUnitId = ? AND w.event = ?`;
      const values = [params.businessUnit.businessUnitId, params.event];
      const selectWebhooksQuery = await connection.query(query, values);
      connection.release();
      const webhooks = selectWebhooksQuery[0] || [];
      if (webhooks.length) {
        const _loop = async hooks => {
          for (let i = 0; i < hooks.length; i++) {
            const webhook = hooks[i];
            let _connection = null;
            const body = {
              data: params.payload,
              hook: {
                id: webhook.id,
                target_url: webhook.target_url,
                event: webhook.event
              }
            };
            try {
              const params = {
                MessageBody: JSON.stringify(body),
                QueueUrl: process.env.AWS_SQS_WEBHOOK_QUEUE_URL
              };
              const data = await SQS.sendMessage(params).promise();
              _connection = await db.getIristelXConnection();
              //TODO:  should we store this in our DB for reference/retries/audits....
              const values = [data.MessageId, webhook.id, body];
              await _connection.execute(
                "INSERT INTO webhookMessages (messageId, webhookId, payload) VALUES (?,?,?)",
                values
              );
            } catch (e) {
              logger.error(
                `Could not successfully process '${
                  params.event
                }' event for webhook: '${
                  webhook.id
                }' with payload: ${JSON.stringify(body)} due to: ${e}`
              );
            } finally {
              _connection && _connection.release();
            }
          }
        };
        await _loop(webhooks);
      }
      return;
    } catch (e) {
      throw e;
    } finally {
      connection && connection.release();
    }
  }
};
