"use strict";

const debug = require("debug")("manager:broadsoft");
const debugTiming = require("debug")("timing");
const cheerio = require("cheerio");
const crypto = require("crypto");
const logger = require("./../../logger")(module);
const { broadSoftService } = require("./../../services");
const { genericError } = require("./../../utils/error");
const { stripAccents } = require("./../../utils/strings");
const { NS_PER_SEC } = require("./../../utils/constants");

const generatePassword = () => {
  return (
    Math.random()
      .toString(36)
      .substr(2)
      .toUpperCase() +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.floor(Math.random() * 10)
  );
};

const generateIPSwitchPassword = serviceId => {
  return crypto
    .createHash("md5")
    .update(serviceId)
    .digest("hex");
};

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
        let tmpValue = "";
        const splitValues = value.split("@");
        splitValues.forEach((_value, index) => {
          if (index > 0) {
            tmpValue += "@";
          }
          const placeholders = _value.match(/[^<]+(?=>)/g);
          let tmp = "";
          if (placeholders) {
            placeholders.forEach(placeholder => {
              let stripCharacters = false;
              const parsed = placeholder.split(".");
              if (parsed.length === 1) {
                switch (parsed[0].toLowerCase()) {
                  case "random":
                    tmp = generatePassword();
                    break;
                  case "ipswitchpassword":
                    tmp = generateIPSwitchPassword(data.account.serviceId);
                    data.account.ipSwitchPassword = tmp;
                    break;
                  default:
                    tmp = data[parsed[0]];
                }
              } else {
                tmp = parsed.reduce((acc, cv, i, arr) => {
                  if (!stripCharacters && (cv === "lname" || cv === "fname")) {
                    stripCharacters = true;
                  }
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
                tmpValue += _value.replace(
                  re,
                  stripCharacters
                    ? stripAccents(tmp.replace(/[%\+"\\]/g, ""))
                    : tmp
                );
              }
            });
          } else if (_value.toLowerCase() === "null") {
            undefinedFlag = true;
            xml.pop();
            xml.push(`<${key} xsi:nil="true"/>`);
          } else {
            tmpValue += _value;
          }
          if (!undefinedFlag && index === splitValues.length - 1) {
            xml.push(tmpValue);
          }
        });
      } else {
        xml.push(generateSoapPayload(value, data));
      }
      if (!undefinedFlag) {
        xml.push(`</${key}>`);
      }
    }
  });
  return xml.join("");
};

/**
 * Class that handles any/all functionality related to broadsoft provisioning.
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
    logger.info("BroadSoftManager execute");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.account === "undefined" ||
      typeof params.account.serviceId === "undefined" ||
      typeof params.operations === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "BroadSoftManager execute failed due to: One of required account, account.serviceId, operations and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    try {
      let soapbody = [];
      let orderOfOperations = [];
      let errors = [];
      let data = [];
      (params.operations || []).map(operation => {
        const [key, value] = Object.entries(operation)[0];
        orderOfOperations.push(key);
        soapbody.push(
          `<command xsi:type="${key}" xmlns="" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`
        );
        soapbody.push(generateSoapPayload(value, params));
        soapbody.push("</command>");
      });
      logger.info(soapbody.join(""));
      if (soapbody.length) {
        const response = await broadSoftService.makeSOAPRequest(
          soapbody.join(""),
          params
        );
        const $ = cheerio.load(response, {
          xmlMode: true
        });
        const commandResponses = $("command");
        Array.from(commandResponses || []).forEach((command, index) => {
          if (["Error", "Warning"].indexOf(command.attribs.type) > -1) {
            logger.error(`Broadsoft operation: ${orderOfOperations[index]} for account ${params.account.serviceId} failed due to
          ${command.children[0].children[0].data}`);
            errors.push(`Broadsoft operation: ${orderOfOperations[index]} for account ${params.account.serviceId} failed due to
          ${command.children[0].children[0].data}`);
          } else {
            data.push(command);
          }
        });
      }
      params.errors = errors;
      params.response = data;
      return params;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `BroadSoftManager execute took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
