"use strict";

const debug = require("debug")("manager:ipswitch");
const debugTiming = require("debug")("timing");
const cheerio = require("cheerio");
const logger = require("./../../logger")(module);
const {ipSwitchService} = require("./../../services");
const {genericError} = require("./../../utils/error");
const { NS_PER_SEC } = require("./../../utils/constants");


const generateSoapPayload = (operations, data, xml = []) => {
  let keys = Object.keys(operations);
  (keys || []).map(key => {
    let value = operations[key];
    if (Array.isArray(value)) {
      value.forEach(item => {
        xml.push(`<${key}>${item}</${key}>`);
      });
    } else {
      let undefinedFlag = false;
      xml.push(`<${key}>`);
      if (typeof value === "string") {
        const placeholders = value.match(/[^<]+(?=>)/g);
        let tmp = "";
        if (placeholders) {
          placeholders.forEach(placeholder => {
            const parsed = placeholder.split(".");
            if (parsed.length === 1) {
              switch (parsed[0].toLowerCase()) {
                // case "random":
                //   tmp = generatePassword();
                //   break;
                // case "ipswitchpassword":
                //   tmp = generatePassword();
                //   data.account.ipSwitchPassword = tmp;
                //   break;
                default:
                  tmp = data[parsed[0]];
              }
            } else {
              tmp = parsed.reduce((acc, cv, i, arr) => {
                if (typeof acc[cv] === "undefined") {
                  undefinedFlag = true;
                  arr.splice(--i);
                  return acc;
                } else {
                  return acc[cv];
                }
              }, data);
            }
            if (undefinedFlag) {
              xml.pop();
            } else {
              const re = new RegExp(`<${placeholder}>`, "g");
              value = value.replace(re, tmp);
            }
          });
        } else if (value.toLowerCase() === "null") {
          undefinedFlag = true;
          xml.pop();
          xml.push(`<${key} xsi:nil="true"/>`);
        }
        if (!undefinedFlag) {
          xml.push(value);
        }
      } else {
        if ((typeof value === "boolean") || (typeof value === "number")) {
          xml.push(value);
        } else {
          xml.push(generateSoapPayload(value, data));
        }
      }
      if (!undefinedFlag) {
        xml.push(`</${key}>`);
      }
    }
  });
  return xml.join("");
};

/**
 * Class that handles any/all functionality related to ipswitch provisioning.
 */
module.exports = {
  /**
   * Create master account.
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
    logger.info("IPSwitchManager execute");
    const _timeStart = process.hrtime();
    if (!params ||
      typeof params.account === "undefined" ||
      typeof params.account.serviceId === "undefined" ||
      typeof params.account.contact === "undefined" ||
      typeof params.operations === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message: "IPSwitchManager execute failed due to: One of required account, account.serviceId, account.contact, operations and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    try {
      let soapbody = [];
      let orderOfOperations = [];
      let errors = [];
      (params.operations || []).map(operation => {
        const [key, value] = Object.entries(operation)[0];
        orderOfOperations.push(key);
        soapbody.push(generateSoapPayload(value, params));
      });

      if (soapbody.length) {
        const [key, value] = Object.entries(params.operations[0])[0];
        const response = await ipSwitchService.makeSOAPRequest(key, soapbody.join(""), params);
        const $ = cheerio.load(response, {
          xmlMode: true
        });
        const isError = $("Success").text();
        const error = $("ErrorMessage").text();
        if (isError === "false") {
          errors.push(`IPSwitchManager error for account ${params.account.serviceId} due to ${error}`);
          logger.error(`IPSwitchManager error for account ${params.account.serviceId} due to ${error}`);
        }
      }
      params.errors = errors;
      return params;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(`IPSwitchManager execute took ${(_timeEnd[0] * NS_PER_SEC + _timeEnd[1]) / NS_PER_SEC} seconds`, debugTiming);
    }
  }
};