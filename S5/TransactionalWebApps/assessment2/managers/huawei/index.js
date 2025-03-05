"use strict";

const debug = require("debug")("manager:huawei");
const debugTiming = require("debug")("timing");
const logger = require("./../../logger")(module);
const {huaweiService} = require("./../../services");
const {genericError} = require("./../../utils/error");
const { NS_PER_SEC } = require("./../../utils/constants");


const parseObjectParams = (operation, data, obj) => {
  let keys = Object.keys(operation);
  (keys || []).map(key => {
    let value = operation[key];
    if (typeof value === "string") {
      let tmpValue = value;
      const placeholders = value.match(/[^<]+(?=>)/g);
      let tmp = "";
      if (placeholders) {
        placeholders.forEach(placeholder => {
          const parsed = placeholder.split(".");
          if (parsed.length === 1) {
            switch (parsed[0].toLowerCase()) {
              default:
                tmp = data[parsed[0]];
            }
          } else {
            tmp = parsed.reduce((acc, cv, i, arr) => {
              if (typeof acc[cv] === "undefined") {
                arr.splice(--i);
                return acc;
              } else {
                return acc[cv];
              }
            }, data);
          }
          const re = new RegExp(`<${placeholder}>`, "g");
          tmpValue = tmpValue.replace(re, tmp);
        });
      }
      obj[key] = tmpValue;
    } else if ((typeof value === "boolean") || (typeof value === "number")) {
      obj[key] = value;
    } else {
      obj[key] = parseObjectParams(value, data, {});
    }
  });
  return obj;
};

const generateRequestObject = (operations, data, obj) => {
  (operations || []).map(operation => {
    obj = parseObjectParams(operation, data, obj);
  });
  logger.info(obj);
  return obj;
};

/**
 * Class that handles any/all functionality related to huawei provisioning.
 */
module.exports = {
  /**
   * Execute huawei request(s).
   *
   * @param {object} params
   * {
   *    @param {object} account(required) {
   *      @param {string} serviceId(required)  The service id of the account.
   *       ...
   *      }
   *    }
   *    @param {array} operations(required) {
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async execute(params = {}) {
    logger.info("HuaweiManager execute");
    const _timeStart = process.hrtime();
    if (!params ||
      typeof params.account === "undefined" ||
      typeof params.account.serviceId === "undefined" ||
      typeof params.operations === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message: "HuaweiManager execute failed due to: One of required account, account.serviceId, operations and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    try {
      return await huaweiService.makeRequest(generateRequestObject(params.operations, params, {}));
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(`HuaweiManager execute took ${(_timeEnd[0] * NS_PER_SEC + _timeEnd[1]) / NS_PER_SEC} seconds`, debugTiming);
    }
  }
};