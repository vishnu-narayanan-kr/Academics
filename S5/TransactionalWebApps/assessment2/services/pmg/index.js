"use strict";

const debug = require("debug")("service:pmg");
const logger = require("./../../logger")(module);
const env = require("./../../config/env");
const request = require("request-promise-native");
const soapBodyGenerator = require("./soap-generator");
const { decrypt } = require("./../../utils/encryption");
const url = env.mind.pmg.wsdl_url;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = {
  async makeSOAPRequest(operation, params) {
    logger.info(`calling MIND PMG makeSoapRequest for operation: ${operation}`);
    try {
      const soapbody = soapBodyGenerator[operation](
        Object.assign(params || {}, {
          operation
        })
      );
      const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
          xmlns:bean="http://beans.core.paymentmanager.mind.com/">
          <soapenv:Header/>
          <soapenv:Body>
            <bean:${operation}>
                <arg0>
                  <application>Provisioning API</application>
                  <externalUser>API Daemon</externalUser>
                  <password>${decrypt(
                    params.businessUnit.config.mind.pmg.password
                  )}</password>
                  <username>${
                    params.businessUnit.config.mind.pmg.username
                  }</username>
                </arg0>
                <arg1>
                  ${soapbody}
                </arg1>
            </bean:${operation}>
          </soapenv:Body>
      </soapenv:Envelope>`;
      const options = {
        url,
        method: "POST",
        body: xml,
        proxy: env.quota_guard.proxy,
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          // "Accept-Encoding": "gzip,deflate",
          "Content-Length": xml.length,
          SOAPAction: ""
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
