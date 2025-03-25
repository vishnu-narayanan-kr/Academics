"use strict";

const debug = require("debug")("service:huawei");
const logger = require("./../../logger")(module);
const env = require("./../../config/env");
const request = require("request-promise-native");

module.exports = {
  async makeRequest(params) {
    logger.info(`calling Huawei makeRequest`);
    logger.info(params);
    try {
      const options = {
        url: `${env.huawei.base_url}${params.url}`,
        method: params.method,
        body: JSON.stringify(params.body || {}),
        proxy: env.quota_guard.proxy,
        simple: false,
        resolveWithFullResponse: true,
        headers: {
          "X-API-KEY": env.huawei.api_key
        }
      };
      const response = await request(options);
      logger.info(response.statusCode);
      logger.info(response.body);
      if (response.statusCode !== 200 && response.statusCode !== 409) {
        const error = new Error(response.body.message);
        error.errors = [];
        error.errors.push({
          code: response.body.error,
          message: response.body.message
        });
        throw error;
      }
      return response;
    } catch (e) {
      logger.error(e);
      e.errors = [];
      try {
        const error = JSON.parse(e.error);
        error.code = error.error;
        delete error.error;
        delete error.result;
        delete error.content;
        e.errors.push(error);
      } catch (ex) {}
      throw e;
    }
  }
};
