"use strict";

const debug = require("debug")("service:nextologies");
const logger = require("./../../logger")(module);
const env = require("./../../config/env");
const request = require("request-promise-native");

module.exports = {
  async makeRequest(params) {
    logger.info(`calling Nextologies makeRequest`);
    logger.info(params);
    try {
      const options = {
        url: `${env.nextologies.base_url}${params.url}`,
        method: params.method || "GET",
        body: JSON.stringify(params.body || {}),
        proxy: env.quota_guard.proxy,
        resolveWithFullResponse: true,
        simple: false,
        headers: {
          "X-API-KEY": env.nextologies.api_key,
          "Content-Type": "application/json"
        }
      };
      const response = await request(options);
      if (response.statusCode !== 200) {
        const error = new Error(response.statusMessage);
        const errors = JSON.parse(response.body).errors;
        error.errors = errors.map(err => {
          return {
            code: err.code || null,
            param: err.param || null,
            message: err.message
          };
        });
        throw error;
      }
      return JSON.parse(response.body);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
