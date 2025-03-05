"use strict";

const debug = require("debug")("service:broadsoft");
const logger = require("./../../logger")(module);
const env = require("./../../config/env");
const uuidv4 = require("uuid/v4");
const crypto = require("crypto");
const request = require("request-promise-native");
const cheerio = require("cheerio");
const { decrypt } = require("./../../utils/encryption");
const { genericError } = require("./../../utils/error");

const url = env.broadsoft.wsdl_url;

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
  async authRequest(params) {
    logger.info(`calling Broadsoft authRequest`);
    try {
      const sessionkey = uuidv4();
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Body>
          <processMessage soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <arg0 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
              <![CDATA[<BroadsoftDocument protocol="OCI" xmlns="C" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <sessionId xmlns="">${sessionkey}</sessionId>
                <command xsi:type="AuthenticationRequest" xmlns="">
                  <userId>${params.businessUnit.config.broadsoft.username ||
                    ""}</userId>
                </command>
              </BroadsoftDocument>]]>
            </arg0>
          </processMessage>
        </soapenv:Body>
      </soapenv:Envelope>`;

      const options = {
        url,
        method: "POST",
        body: xml,
        proxy: env.quota_guard.proxy,
        resolveWithFullResponse: true,
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          // "Accept-Encoding": "gzip,deflate",
          "Content-Length": xml.length,
          SOAPAction: ""
        }
      };
      const authResponse = await request(options);
      const unescaped = unescapeHtml(authResponse.body);
      const $ = cheerio.load(unescaped, {
        xmlMode: true
      });
      const fault = $("soapenv\\:Fault");
      if (fault && fault.length) {
        const message = $(fault)
          .find("detail")
          .find("string")
          .text();
        throw genericError({
          type: "BroadSoftError",
          message,
          status: 500,
          code: 500
        });
      }
      if ($("command")[0].attribs.type === "Error") {
        throw genericError({
          type: "BroadSoftError",
          message: $("command")[0].children[0].children[0].data,
          status: 500,
          code: 500
        });
      } else {
        return {
          jsessionid: authResponse.request.response.headers[
            "set-cookie"
          ][0].split(";")[0],
          nonce: $("nonce")[0].children[0].data,
          session: sessionkey
        };
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },

  async loginRequest(params) {
    logger.info(`calling Broadsoft loginRequest`);
    try {
      const password = crypto
        .createHash("md5")
        .update(
          params.nonce +
            ":" +
            crypto
              .createHash("sha1")
              .update(decrypt(params.businessUnit.config.broadsoft.password))
              .digest("hex")
        )
        .digest("hex");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Body>
            <processMessage soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <arg0 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
                <![CDATA[<BroadsoftDocument protocol="OCI" xmlns="C" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <sessionId xmlns="">${params.session}</sessionId>
                <command xsi:type="LoginRequest14sp4" xmlns="">
                  <userId>${params.businessUnit.config.broadsoft.username ||
                    ""}</userId>
                  <signedPassword>${password}</signedPassword>
                </command>
                </BroadsoftDocument>]]>
              </arg0>
            </processMessage>
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
          SOAPAction: "",
          Cookie: params.jsessionid
        }
      };
      const body = await request(options);
      const unescaped = unescapeHtml(body);
      const $ = cheerio.load(unescaped, {
        xmlMode: true
      });
      const fault = $("soapenv\\:Fault");
      if (fault && fault.length) {
        const message = $(fault)
          .find("detail")
          .find("string")
          .text();
        throw genericError({
          type: "BroadSoftError",
          message,
          status: 500,
          code: 500
        });
      }
      if ($("command")[0].attribs.type === "Error") {
        throw genericError({
          type: "BroadSoftError",
          message: $("command")[0].children[0].children[0].data,
          status: 500,
          code: 500
        });
      } else {
        return {};
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  },

  async makeSOAPRequest(soapbody, params) {
    logger.info(`calling Broadsoft makeSoapRequest for operations`);
    try {
      const { jsessionid, nonce, session } = await this.authRequest(params);
      params.nonce = nonce;
      params.session = session;
      params.jsessionid = jsessionid;
      const loginResponse = await this.loginRequest(params);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <soapenv:Body>
              <processMessage soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                <arg0 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
                  <![CDATA[<BroadsoftDocument protocol="OCI" xmlns="C" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <sessionId xmlns="">${params.session}</sessionId>
                      ${soapbody}
                  </BroadsoftDocument>]]>
                </arg0>
              </processMessage>
            </soapenv:Body>
          </soapenv:Envelope>`;
      const options = {
        url,
        method: "POST",
        body: xml,
        proxy: env.quota_guard.proxy,
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          SOAPAction: "",
          Cookie: params.jsessionid
        }
      };
      const body = await request(options);
      const unescaped = unescapeHtml(body);
      const $ = cheerio.load(unescaped, {
        xmlMode: true
      });
      const fault = $("soapenv\\:Fault");
      if (fault && fault.length) {
        const message = $(fault)
          .find("detail")
          .find("string")
          .text();
        throw genericError({
          type: "BroadSoftError",
          message,
          status: 500,
          code: 500
        });
      }
      return unescaped;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
