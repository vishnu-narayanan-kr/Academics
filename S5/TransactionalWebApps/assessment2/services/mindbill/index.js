"use strict";

const logger = require("./../../logger")(module);
const debug = require("debug")("service:mindbill");
const env = require("./../../config/env");
const { soap } = require("strong-soap");
const uuidv4 = require("uuid/v4");
const cheerio = require("cheerio");
const soapBodyGenerator = require("./soap-generator");
const { decrypt } = require("./../../utils/encryption");
const { genericError } = require("./../../utils/error");
const decode = require("unescape");
const ws = require("ws.js");
const Http = ws.Http;
const Mtom = ws.Mtom;

//BEGIN - HACK TO REMOVE NAMESPACES
// const util = require("util");

// const XMLHandler = soap.XMLHandler;
// const xmlHandler = new XMLHandler();
//END - HACK TO REMOVE NAMESPACES

const url = env.mind.bill.wsdl_url;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const options = {
  connection: "keep-alive",
  wsdl_headers: {
    "User-Agent": "node.js"
  },
  wsdl_options: {
    proxy: env.quota_guard.proxy
  }
};

module.exports = {
  openSession(params) {
    logger.info(`calling makeSoapRequest for operation: openSession`);
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, (error, client) => {
        if (error) {
          logger.error(error);
          reject(error);
        } else {
          try {
            const sessionkey = uuidv4();
            const requestArgs = {
              _xml: `<![CDATA[
                <request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="openSession.xsd">
                    <session key="${sessionkey}"/>
                    <user name="${params.username}" password="${decrypt(
                params.password
              )}"/>
                </request>
                ]]>`
            };
            client.openSession(
              requestArgs,
              (error, result, envelope, soapHeader) => {
                if (error) {
                  return reject(error);
                }
                const $ = cheerio.load(result.openSessionReturn, {
                  xmlMode: true
                });
                const parsedError = $("error").length;
                if (parsedError) {
                  const code = $("code").text();
                  const message = $("message").text();
                  return reject(
                    genericError({
                      message,
                      code
                    })
                  );
                }
                const sessionid = $("session").attr("id");
                resolve({
                  sessionkey,
                  sessionid
                });
              },
              {
                proxy: env.quota_guard.proxy,
                headers: {
                  "User-Agent": "node.js"
                }
              }
            );
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  },

  async closeSession(params) {
    logger.info(`calling makeSoapRequest for operation: closeSession`);
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, (error, client) => {
        if (error) {
          logger.error(error);
          resolve({});
        } else {
          const requestArgs = {
            _xml: `<![CDATA[
          <request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="closeSession.xsd">
              <session id="${params.sessionid}" key="${params.sessionkey}"/>
          </request>
          ]]>`
          };
          client.closeSession(
            requestArgs,
            (error, result, envelope, soapHeader) => {
              logger.info(result.closeSessionReturn);
              resolve({});
            },
            {
              proxy: env.quota_guard.proxy,
              headers: {
                "User-Agent": "node.js"
              }
            }
          );
        }
      });
    });
  },

  makeSOAPRequest(operation, params) {
    logger.info(`calling MINDBill makeSoapRequest for operation: ${operation}`);
    return new Promise((resolve, reject) => {
      try {
        this.openSession(params.businessUnit.config.mind.auth)
          .then(session => {
            soap.createClient(url, options, async (error, client) => {
              if (error) {
                logger.error(error);
                reject(error);
              } else {
                const soapbody = soapBodyGenerator[operation](
                  Object.assign(
                    params || {},
                    {
                      operation
                    },
                    session
                  )
                );
                //BEGIN - HACK TO REMOVE NAMESPACES
                //xmlns="http://api.csr.mind.com/${operation}"
                //END - HACK TO REMOVE NAMESPACES
                const requestArgs = {
                  _xml: `<![CDATA[
                <request xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="${operation}.xsd">
                    <session id="${params.sessionid}" key="${params.sessionkey}"/>
                    ${soapbody}
                </request>
                ]]>`
                };
                if (params.hasAttachment) {
                  const ctx = {
                    request: `<x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://api.csr.mind.com">
                    <x:Header/>
                    <x:Body>
                        <api:${operation}>
                            <api:xml>${requestArgs._xml}</api:xml>
                        </api:${operation}>
                    </x:Body>
                    </x:Envelope>`,
                    contentType: "application/soap+xml",
                    url: url,
                    action: ""
                  };

                  const handlers = [
                    new Mtom(),
                    new Http({
                      proxy: env.quota_guard.proxy
                    })
                  ];

                  ws.send(handlers, ctx, async ctx => {
                    await this.closeSession(params);
                    if (error) {
                      debug(error);
                      logger.error(error);
                      return reject(error);
                    }
                    debug(decode(ctx.response));
                    resolve({
                      xml: decode(ctx.response),
                      multipart: ctx.attachment
                    });
                  });
                } else {
                  if (client[operation]) {
                    let multipart = null;
                    client.on("response", (body, response) => {
                      multipart = response;
                    });

                    client[operation](
                      requestArgs,
                      async (error, xml, envelope, soapHeader) => {
                        await this.closeSession(params);
                        if (error) {
                          debug(error);
                          logger.error(error);
                          return reject(error);
                        }
                        debug(xml);
                        //BEGIN - HACK TO REMOVE NAMESPACES
                        // const root = xmlHandler.xmlToJson(null, xml[operation + "Return"], null);
                        // debug("%s", util.inspect(root, { depth: null }));
                        // const node = xmlHandler.jsonToXml(null, null,
                        //   XMLHandler.createSOAPEnvelopeDescriptor('soap'), root);
                        // const xml1 = node.end({pretty: true});
                        // debug(xml1);
                        // xml[operation + "Return"] = xml1;
                        //END - HACK TO REMOVE NAMESPACES
                        resolve({
                          xml,
                          multipart
                        });
                      },
                      {
                        proxy: env.quota_guard.proxy,
                        headers: {
                          "User-Agent": "node.js"
                        }
                      }
                    );
                  } else {
                    await this.closeSession(params);
                    reject(
                      genericError({
                        message: "Cannot complete request."
                      })
                    );
                  }
                }
              }
            });
          })
          .catch(reject);
      } catch (e) {
        reject(e);
      }
    });
  },

  /**
   *
   * @param {object} params
   * {
   *    @param {string} operation(required)  The MIND operation to perform.
   *    @param {object} data(required) The data needed for the operation.
   *    @param {string} errorMessage(optional) The error message to return if operation fails.
   *    @param {boolean} throwError(optional) Throw an error if one occurs.
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to make request.
   * }
   */
  async execute(params = {}) {
    if (
      !params ||
      typeof params.operation === "undefined" ||
      typeof params.data === "undefined" ||
      (params.data && typeof params.data.businessUnit === "undefined")
    ) {
      throw genericError({
        message:
          "MINDBill service failed due to: One of required operation, data, and/or businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    const data = await this.makeSOAPRequest(params.operation, params.data);
    const $ = cheerio.load(
      params.data.hasAttachment
        ? data.xml
        : data.xml[`${params.operation}Return`],
      {
        xmlMode: true
      }
    );
    const parsedError = $("error").length;
    let code = null;
    let message = null;
    if (parsedError) {
      code = $("code").text();
      message = $("message").text();
      if (!!params.throwError) {
        throw genericError({
          message: `${params.errorMessage || "An error has occurred"}`,
          status: 500,
          code: 500,
          errors: [
            {
              code,
              message
            }
          ]
        });
      }
    }
    return { data, $, parsedError: { code, message } };
  }
};
