"use strict";

const debug = require("debug")("service:espresso-did");
const logger = require("./../../logger")(module);
const env = require("./../../config/env");
const { decrypt } = require("./../../utils/encryption");
const request = require("request-promise-native");
const soapBodyGenerator = require("./soap-generator");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = {
  async makeSOAPRequest(operation, params) {
    logger.info(`calling Espresso makeSoapRequest for operation: ${operation}`);
    try {
      const wsdl_url = env.espresso_did.wsdl_url;
      const soapbody = soapBodyGenerator[operation](
        Object.assign(params || {}, {
          operation
        })
      );
      const xml = `<Envelope>
          <Header>
            <Credentials>
              <username>${
                params.businessUnit.config.espresso_did.username
              }</username>
              <password>${decrypt(
                params.businessUnit.config.espresso_did.password
              )}</password>
            </Credentials>
          </Header>
          <Body>
            <${operation}>
              ${soapbody}
            </${operation}>
          </Body>
      </Envelope>`;
      const options = {
        url: wsdl_url,
        method: "POST",
        body: xml,
        proxy: env.quota_guard.proxy,
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          SOAPAction: `${wsdl_url}#${operation}`
        }
      };
      const body = await request(options);
      return body;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
