"use strict";

const debug = require("debug")("service:ipswitch");
const logger = require("./../../logger")(module);
const env = require("./../../config/env");
const request = require("request-promise-native");
const { decrypt } = require("./../../utils/encryption");

const url = env.ipswitch.wsdl_url;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const unescapeHtml = safe => {
  return safe
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&reg;/g, "®")
    .replace(/&#174;/g, "®")
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'");
};

module.exports = {
  async makeSOAPRequest(operation, soapbody, params) {
    logger.info(`calling IPSwitch makeSoapRequest for operation: ${operation}`);
    try {
      const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
            <soapenv:Header>
                <tem:AuthHeader xmlns:tem="http://tempuri.org/" xmlns="http://tempuri.org/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <UserName>${params.businessUnit.config.ipswitch.username ||
                      ""}</UserName>
                    <Password>${decrypt(
                      params.businessUnit.config.ipswitch.password || ""
                    )}</Password>
                </tem:AuthHeader>
            </soapenv:Header>
            <soapenv:Body xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <Execute xmlns="http://tempuri.org/">
                    <request xsi:type="${operation}">
                    ${soapbody}
                    </request>
                </Execute>
            </soapenv:Body>
        </soapenv:Envelope>`;

      const options = {
        url,
        method: "POST",
        body: xml,
        proxy: env.quota_guard.proxy,
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          SOAPAction: "http://tempuri.org/Execute"
        }
      };
      const body = await request(options);
      return unescapeHtml(body);
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
