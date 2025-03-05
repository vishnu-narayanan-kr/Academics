"use strict";

const debug = require("debug")("manager:porting");
const debugTiming = require("debug")("timing");
const db = require("./../../database");
const cheerio = require("cheerio");
const logger = require("./../../logger")(module);
const { espressoService, webHookService } = require("./../../services");
const dateUtils = require("./../../utils/dates");
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const differenceInDays = require("date-fns/difference_in_days");
const subDays = require("date-fns/sub_days");
const { compareJSON } = require("./../../utils/helpers");
const { stripAccents } = require("./../../utils/strings");
const { stripCharacters } = require("./../../utils/strings");
const { stripNonAlphaNumericCharacters } = require("./../../utils/strings");
const { NS_PER_SEC, PORTING_STATUSES } = require("./../../utils/constants");

/**
  PORTING RULES
	  Status                    Allow update	            Allow cancel
    Pending	                      yes	                      yes
    Processed	                     no	                      yes
    Rejected. Pending Update	    yes	                      yes
    Confirmed	                Only postpone due date   Cancel if dateDiff between
                              if dateDiff between now  now and current due date
                              and current due date     >=24 hours (1 day)
                              >=24 hours(1 day)                                         	  
    Pending Cancellation	         no	                       no
    Cancelled	                     no	                       no
    Closed	                       no	                       no 
*/

/**
 * Class that handles any/all functionality related to porting.
 */
module.exports = {
  /**
   * Check portability of specfied number.
   *
   * @param {object} params
   * {
   *    @param {string} npanxx(required)  The areaCode and exchangeCode.
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  async checkPortability(params = {}) {
    logger.info("PortingManager checkPortability");
    const _timeStart = process.hrtime();
    if (!params || typeof params.npanxx === "undefined") {
      throw genericError({
        message: "Required npanxx is missing for number portability check.",
        status: 400,
        code: 400
      });
    }
    try {
      const data = await espressoService.makeSOAPRequest(
        "lnpCheckNpaNxxPortability",
        params
      );
      const $ = cheerio.load(data, {
        xmlMode: true
      });
      const response = $("lnpCheckNpaNxxPortabilityResponse");
      const parsedError = response.find("errors");
      if (parsedError && parsedError.children().length) {
        const errors = parsedError
          .children()
          .toArray()
          .map(child => {
            const code = $(child)
              .find("code")
              .text();
            const message = $(child)
              .find("message")
              .text();
            return {
              code,
              message
            };
          });
        throw genericError({
          message: "Number Portability Check failed.",
          status: 500,
          code: 500,
          errors
        });
      }
      const isPortable = !!parseInt(
        $(response)
          .find("return")
          .text()
      );
      return {
        isPortable
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PortingManager checkPortability took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Create a port request for specified number.
   *
   * @param {object} params
   * {
   *    @param {string} telephoneNumber(required)  The telephone number to be transferred from the existing provider (losing carrier).
   *    @param {string} providerName(required)  The Provider that currently hosts the Telephone Number that the Account Holder wishes to Port-In. This is also known as the losing carrier.
   *    @param {string} providerAccountNumber(required)  The Account Number associated with the existing provider and telephone number that is to be ported-in.
   *      This must match the existing provider's records or the transfer request will be rejected.
   *    @param {String} desiredDueDate(required)  The date the account holder is requesting for the transfer to take effect.
   *    @param {string} serviceType(required)  The type of service for the phone number being transferred.
   *    @param {string} fullName(required)  The full name of the account holder. This must match the current provider's records.
   *    @param {string} streetNumber(required)  The street number of the account holder. This must match the current provider's records.
   *    @param {string} streetName(required)  The street name of the account holder. This must match the current provider's records.
   *    @param {string} unitNumber(optional)  If applicable, the unit number of the account holder. This must match the current provider's records.
   *    @param {string} city(required)  The city of the account holder. This must match the current provider's records.
   *    @param {string} province(required)  The province of the account holder. This must match the current provider's records.
   *    @param {string} postalCode(required)  The postal code of the account holder. This must match the current provider's records.
   *    @param {string} comments(optional)  Comments or special instructions related to this transfer request may be entered.
   *    @param {string} serviceId(required)  The serviceId that the telephone number will be assigned to when the transfer is complete.
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  async createPortRequest(params = {}) {
    logger.info("PortingManager createPortRequest");
    const _timeStart = process.hrtime();
    if (
      !params ||
      !params.telephoneNumber ||
      !params.providerName ||
      !params.providerAccountNumber ||
      !params.desiredDueDate ||
      !params.serviceType ||
      !params.fullName ||
      !params.streetNumber ||
      !params.streetName ||
      !params.city ||
      !params.province ||
      !params.postalCode ||
      !params.serviceId ||
      !params.businessUnit ||
      (params.businessUnit &&
        typeof params.businessUnit.businessUnitId === "undefined")
    ) {
      throw genericError({
        message: `Create porting request failed due to: One of the required telephoneNumber, providerName, providerAccountNumber,
        desiredDueDate, serviceType, fullName, streetNumber, streetName, city, province, serviceId,  
        businessUnit/businessUnitId is missing.`,
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      //check if number is not in our porting table with status !== Closed or Canceled
      let query = `SELECT COUNT(*) as count FROM porting WHERE telephoneNumber = ? AND status NOT IN ("Closed", "Canceled")`;
      let values = [params.telephoneNumber];
      let numberCheckResponse = await connection.query(query, values);
      if (numberCheckResponse[0][0] && numberCheckResponse[0][0].count > 0) {
        throw genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10030,
              message: ERROR_CODES[10030]
            }
          ]
        });
      }
      query = `SELECT ma.code AS masterAccount, COUNT(*) as count FROM serviceAccounts AS sa JOIN 
      masterAccounts AS ma ON ma.id = sa.masterAccount WHERE ma.businessUnitId = ? AND sa.code = ?`;
      values = [params.businessUnit.businessUnitId, params.serviceId];
      let selectResponse = await connection.query(query, values);
      if (selectResponse[0][0] && selectResponse[0][0].count === 1) {
        query = `SELECT COUNT(*) as count FROM porting as p WHERE p.businessUnitId = ? AND p.serviceId = ? 
        AND p.status IN ("Pending", "Processed", "Rejected. Pending Update", "Confirmed", "Updated", "Pending Cancellation")`;
        values = [params.businessUnit.businessUnitId, params.serviceId];
        const statusResponse = await connection.query(query, values);
        if (statusResponse[0][0] && statusResponse[0][0].count === 0) {
          params.telephoneNumber = params.telephoneNumber.substring(1);
          params.serviceType = params.serviceType.replace(/^\w/, c =>
            c.toUpperCase()
          );
          if (params.postalCode === 6) {
            params.postalCode = params.postalCode.split("");
            params.postalCode.splice(3, 0, " ");
            params.postalCode = params.postalCode.join("");
          }
          const accountId = selectResponse[0][0].masterAccount;
          // const requestDate = dateUtils.formatDate(subDays(new Date(), 1));
          const requestDate = dateUtils.formatDate(new Date());
          params.requestDate = requestDate;
          const numberOfDays =
            params.serviceType.toLowerCase() === "wireline" ? 3 : 1;
          if (
            differenceInDays(
              new Date(dateUtils.formatDate(params.desiredDueDate)),
              new Date(dateUtils.formatDate(new Date()))
            ) <= numberOfDays
          ) {
            throw genericError({
              status: 403,
              code: 403,
              errors: [
                {
                  code:
                    params.serviceType.toLowerCase() === "wireline"
                      ? 10016
                      : 10017,
                  message:
                    ERROR_CODES[
                      params.serviceType.toLowerCase() === "wireline"
                        ? 10016
                        : 10017
                    ]
                }
              ]
            });
          }
          params.desiredDueDate = dateUtils.formatDate(params.desiredDueDate);
          //SANITIZE FIELDS FOR ESPRESSO
          params.fullName = stripNonAlphaNumericCharacters(
            stripAccents(params.fullName)
          );
          params.providerName = stripNonAlphaNumericCharacters(
            stripAccents(params.providerName)
          );
          params.city = stripNonAlphaNumericCharacters(
            stripAccents(params.city)
          );
          params.streetName = stripNonAlphaNumericCharacters(
            stripAccents(params.streetName)
          );
          params.comments = stripCharacters(
            stripAccents(params.comments),
            /[^a-zA-Z0-9\s@/\\,;.#&]+/g
          );

          let data = await espressoService.makeSOAPRequest(
            "lnpCreatePons",
            params
          );
          let $ = cheerio.load(data, {
            xmlMode: true
          });
          const lnpCreatePonsResponse = $("lnpCreatePonsResponse");
          let parsedError = lnpCreatePonsResponse.find("errors");
          if (parsedError && parsedError.children().length) {
            const errors = parsedError
              .children()
              .toArray()
              .map(child => {
                const code = $(child)
                  .find("code")
                  .text();
                const message = $(child)
                  .find("message")
                  .text();
                return {
                  code,
                  message
                };
              });
            throw genericError({
              message: "New Porting Request failed.",
              status: 403,
              code: 403,
              errors
            });
          }
          const requestId = lnpCreatePonsResponse
            .find("return")
            .find("pon")
            .text();
          const status = "Pending";
          query = `INSERT INTO porting (requestId, status, requestDate, providerName, providerAccountNumber, serviceType, fullName, 
          city, province, desiredDueDate, telephoneNumber, streetNumber, streetName, unitNumber, postalCode, comments, 
          serviceId, accountId, businessUnitId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
          values = [
            requestId,
            status,
            requestDate,
            params.providerName,
            params.providerAccountNumber,
            params.serviceType,
            params.fullName,
            params.city,
            params.province,
            params.desiredDueDate,
            `1${params.telephoneNumber}`,
            params.streetNumber,
            params.streetName,
            params.unitNumber || "",
            params.postalCode,
            params.comments || "",
            params.serviceId,
            accountId,
            params.businessUnit.businessUnitId
          ];
          await connection.query(query, values);
          try {
            await webHookService.send({
              event: "porting_request.created",
              payload: {
                requestId,
                status,
                requestDate,
                providerName: params.providerName,
                providerAccountNumber: params.providerAccountNumber,
                serviceType: params.serviceType,
                fullName: params.fullName,
                city: params.city,
                province: params.province,
                desiredDueDate: params.desiredDueDate,
                telephoneNumber: `1${params.telephoneNumber}`,
                streetNumber: params.streetNumber,
                streetName: params.streetName,
                unitNumber: params.unitNumber || "",
                postalCode: params.postalCode,
                comments: params.comments || "",
                statusReason: "",
                note: "",
                serviceId: params.serviceId,
                accountId
              },
              businessUnit: params.businessUnit
            });
          } catch (e) {
            logger.error(e);
          }

          return {
            requestId,
            status,
            requestDate,
            telephoneNumber: `1${params.telephoneNumber}`,
            providerName: params.providerName,
            providerAccountNumber: params.providerAccountNumber,
            desiredDueDate: params.desiredDueDate,
            serviceType: params.serviceType,
            fullName: params.fullName,
            streetNumber: params.streetNumber,
            streetName: params.streetName,
            unitNumber: params.unitNumber || "",
            city: params.city,
            province: params.province,
            postalCode: params.postalCode,
            comments: params.comments || "",
            statusReason: "",
            note: "",
            serviceId: params.serviceId,
            accountId
          };
        } else {
          throw genericError({
            status: 403,
            code: 403,
            errors: [
              {
                code: 10018,
                message: ERROR_CODES[10018]
              }
            ]
          });
        }
      } else {
        throw genericError({
          status: 404,
          code: 404,
          errors: [
            {
              code: 10019,
              message: ERROR_CODES[10019]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PortingManager createPortRequest took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Update a port request for specified number/request.
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request id of the porting request to cancel.
   *    @param {string} providerName(optional)  The Provider that currently hosts the Telephone Number that the Account Holder wishes to Port-In. This is also known as the losing carrier.
   *    @param {string} providerAccountNumber(optional)  The Account Number associated with the existing provider and telephone number that is to be ported-in. This must match the existing provider's records or the transfer request will be rejected.
   *    @param {String} desiredDueDate(optional)  The date the account holder is requesting for the transfer to take effect.
   *    @param {string} serviceType(optional)  The type of service for the phone number being transferred.
   *    @param {string} fullName(optional)  The full name of the account holder. This must match the current provider's records.
   *    @param {string} streetNumber(optional)  The street number of the account holder. This must match the current provider's records.
   *    @param {string} streetName(optional)  The street name of the account holder. This must match the current provider's records.
   *    @param {string} unitNumber(optional)  If applicable, the unit number of the account holder. This must match the current provider's records.
   *    @param {string} city(optional)  The city of the account holder. This must match the current provider's records.
   *    @param {string} province(optional)  The province of the account holder. This must match the current provider's records.
   *    @param {string} postalCode(optional)  The postal code of the account holder. This must match the current provider's records.
   *    @param {string} comments(optional)  Comments or special instructions related to this transfer request may be entered.
   *    @param {string} serviceId(optional)  The serviceId that the telephone number will be assigned to when the transfer is complete.
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  async updatePortRequest(params = {}) {
    logger.info("PortingManager updatePortRequest");
    const _timeStart = process.hrtime();
    if (
      !params ||
      !params.requestId ||
      !params.businessUnit ||
      (params.businessUnit &&
        typeof params.businessUnit.businessUnitId === "undefined")
    ) {
      throw genericError({
        message: `Update porting request failed due to: One of the required requestId and/or 
        businessUnit/businessUnitId is missing.`,
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT *, COUNT(*) as count FROM porting as p WHERE p.businessUnitId = ? AND p.requestId = ? 
      AND p.status IN ("Rejected. Pending Update", "Confirmed")`;
      let values = [params.businessUnit.businessUnitId, params.requestId];
      //SANITIZE FIELDS FOR ESPRESSO
      if (params.providerName) {
        params.providerName = stripNonAlphaNumericCharacters(
          stripAccents(params.providerName)
        );
      }
      if (params.city) {
        params.city = stripNonAlphaNumericCharacters(stripAccents(params.city));
      }
      if (params.streetName) {
        params.streetName = stripNonAlphaNumericCharacters(
          stripAccents(params.streetName)
        );
      }
      if (params.fullName) {
        params.fullName = stripNonAlphaNumericCharacters(
          stripAccents(params.fullName)
        );
      }
      if (params.comments) {
        params.comments = stripCharacters(
          stripAccents(params.comments),
          /[^a-zA-Z0-9\s@/\\,;.#&]+/g
        );
      }

      const portingResponse = await connection.query(query, values);
      if (portingResponse[0][0] && portingResponse[0][0].count === 1) {
        const portingRequest = portingResponse[0][0];
        delete portingRequest.count;
        delete portingRequest.createdOn;
        delete portingRequest.updatedOn;
        const original = Object.assign({}, portingRequest);
        // const requestDate = dateUtils.formatDate(subDays(new Date(), 1));
        const requestDate = dateUtils.formatDate(new Date());
        portingRequest.requestDate = requestDate;
        delete original.businessUnit;
        delete original.businessUnitId;
        if (params.serviceId) {
          portingRequest.serviceId = params.serviceId;
        }
        if (portingRequest.status.toUpperCase() === "CONFIRMED") {
          if (
            differenceInDays(
              new Date(dateUtils.formatDate(portingRequest.desiredDueDate)),
              new Date(dateUtils.formatDate(new Date()))
            ) <= 1
          ) {
            throw genericError({
              status: 403,
              code: 403,
              errors: [
                {
                  code: 10015,
                  message: ERROR_CODES[10015]
                }
              ]
            });
          }

          let copy = Object.assign({}, params);
          delete copy.businessUnit;
          delete copy.requestId;
          delete copy.desiredDueDate;
          if (
            !params.desiredDueDate ||
            (params.desiredDueDate && Object.keys(copy).length)
          ) {
            copy = null;
            throw genericError({
              status: 400,
              code: 400,
              errors: [
                {
                  code: 10032,
                  message: ERROR_CODES[10032]
                }
              ]
            });
          }
        }
        if (
          portingRequest.status.toUpperCase() !== "CONFIRMED" &&
          params.desiredDueDate &&
          !(params.comments || "").trim()
        ) {
          throw genericError({
            status: 400,
            code: 400,
            errors: [
              {
                code: 10031,
                message: ERROR_CODES[10031]
              }
            ]
          });
        }
        query = `SELECT ma.code AS masterAccount, COUNT(*) as count FROM serviceAccounts AS sa JOIN 
          masterAccounts AS ma ON ma.id = sa.masterAccount WHERE ma.businessUnitId = ? AND sa.code = ?`;
        values = [params.businessUnit.businessUnitId, portingRequest.serviceId];
        let selectResponse = await connection.query(query, values);
        if (selectResponse[0][0] && selectResponse[0][0].count === 1) {
          if (params.providerName) {
            portingRequest.providerName = params.providerName;
          }
          if (params.providerAccountNumber) {
            portingRequest.providerAccountNumber = params.providerAccountNumber;
          }
          if (params.desiredDueDate) {
            // const numberOfDays = (params.serviceType || portingRequest.serviceType).toLowerCase() === "wireline" ? 3 : 1
            // if (differenceInDays(
            //     new Date(dateUtils.formatDate(params.desiredDueDate)),
            //     new Date(dateUtils.formatDate(new Date()))) <= numberOfDays) {
            //   throw genericError({
            //     message: `The specified desiredDueDate ${dateUtils.formatDate(params.desiredDueDate)} must be greater than ${numberOfDays} days from the current date for a ${params.serviceType} service.`,
            //     status: 400,
            //     code: 400
            //   });
            // }
            if (
              differenceInDays(
                new Date(dateUtils.formatDate(params.desiredDueDate)),
                new Date(dateUtils.formatDate(new Date()))
              ) <= 3
            ) {
              throw genericError({
                status: 403,
                code: 403,
                errors: [
                  {
                    code: 10014,
                    message: ERROR_CODES[10014]
                  }
                ]
              });
            }
            portingRequest.desiredDueDate = dateUtils.formatDate(
              params.desiredDueDate
            );
          }
          if (params.serviceType) {
            portingRequest.serviceType = params.serviceType.replace(/^\w/, c =>
              c.toUpperCase()
            );
          }
          if (params.fullName) {
            portingRequest.fullName = params.fullName;
          }
          if (params.streetNumber) {
            portingRequest.streetNumber = params.streetNumber;
          }
          if (params.streetName) {
            portingRequest.streetName = params.streetName;
          }
          if (params.unitNumber) {
            portingRequest.unitNumber = params.unitNumber;
          }
          if (params.city) {
            portingRequest.city = params.city;
          }
          if (params.province) {
            portingRequest.province = params.province;
          }
          if (params.postalCode && params.postalCode.length === 6) {
            params.postalCode = params.postalCode.split("");
            params.postalCode.splice(3, 0, " ");
            params.postalCode = params.postalCode.join("");
          }
          if (params.comments) {
            portingRequest.comments = params.comments;
          }
          portingRequest.businessUnit = params.businessUnit;

          const telephoneNumber = portingRequest.telephoneNumber;
          //espresso wants 10-digit number
          portingRequest.telephoneNumber = portingRequest.telephoneNumber.substring(
            1
          );
          let operation = "lnpEditPon";
          if (portingRequest.status.toUpperCase() === "CONFIRMED") {
            // params.authDate = dateUtils.formatDate(new Date());
            operation = "lnpEditDDD";
          }
          let data = await espressoService.makeSOAPRequest(
            operation,
            portingRequest
          );
          let $ = cheerio.load(data, {
            xmlMode: true
          });
          const lnpEditPonOrDDDResponse = $(`${operation}Response`);
          const parsedError = lnpEditPonOrDDDResponse.find("errors");
          if (parsedError && parsedError.children().length) {
            const errors = parsedError
              .children()
              .toArray()
              .map(child => {
                const code = $(child)
                  .find("code")
                  .text();
                const message = $(child)
                  .find("message")
                  .text();
                return {
                  code,
                  message
                };
              });
            throw genericError({
              message: "Update Porting Request failed.",
              status: 500,
              code: 500,
              errors
            });
          }
          portingRequest.status = "Pending";
          query = `UPDATE porting SET status = ?, requestDate = ?, providerName = ?, 
          providerAccountNumber = ?, serviceType = ?, fullName = ?, city = ?, province = ?, desiredDueDate = ?, 
          telephoneNumber = ?, streetNumber = ?, streetName = ?, unitNumber = ?, postalCode = ?, comments = ?, 
          serviceId = ?, accountId = ?, businessUnitId = ? WHERE requestId = ?`;
          values = [
            portingRequest.status,
            portingRequest.requestDate,
            portingRequest.providerName,
            portingRequest.providerAccountNumber,
            portingRequest.serviceType,
            portingRequest.fullName,
            portingRequest.city,
            portingRequest.province,
            portingRequest.desiredDueDate,
            telephoneNumber,
            portingRequest.streetNumber,
            portingRequest.streetName,
            portingRequest.unitNumber,
            portingRequest.postalCode,
            portingRequest.comments,
            portingRequest.serviceId,
            portingRequest.accountId,
            portingRequest.businessUnitId,
            portingRequest.requestId
          ];
          await connection.query(query, values);
          delete portingRequest.businessUnit;
          delete portingRequest.businessUnitId;

          // place back original format of telephone number for comparison
          portingRequest.telephoneNumber = telephoneNumber;
          const previous = compareJSON(portingRequest, original);
          data = Object.assign({}, portingRequest);
          data.previous = previous;
          try {
            await webHookService.send({
              event: "porting_request.updated",
              payload: data,
              businessUnit: params.businessUnit
            });
          } catch (e) {
            logger.error(e);
          }

          delete portingRequest.operation;
          // delete portingRequest.accountId;
          return portingRequest;
        }
      } else {
        throw genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10013,
              message: ERROR_CODES[10013]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PortingManager updatePortRequest took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Cancel a port request for specified request id.
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request id of the porting request to cancel.
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  async cancelPortRequest(params = {}) {
    logger.info("PortingManager cancelPortRequest");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.requestId === "undefined" ||
      !params.businessUnit ||
      (params.businessUnit &&
        typeof params.businessUnit.businessUnitId === "undefined")
    ) {
      throw genericError({
        message: `Create porting request failed due to: One of the required requestId and/or 
        businessUnit/businessUnitId is missing.`,
        status: 400,
        code: 400
      });
    }

    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT *, COUNT(*) as count FROM porting as p WHERE p.businessUnitId = ? AND p.requestId = ? 
      AND p.status IN ("Pending", "Processed", "Rejected. Pending Update", "Confirmed", "Updated")`;
      let values = [params.businessUnit.businessUnitId, params.requestId];
      const portingResponse = await connection.query(query, values);
      if (portingResponse[0][0] && portingResponse[0][0].count === 1) {
        const portingRequest = portingResponse[0][0];
        delete portingRequest.count;
        delete portingRequest.createdOn;
        delete portingRequest.updatedOn;
        const original = Object.assign({}, portingRequest);
        // const requestDate = dateUtils.formatDate(subDays(new Date(), 1));
        const requestDate = dateUtils.formatDate(new Date());
        portingRequest.requestDate = requestDate;
        delete original.businessUnit;
        delete original.businessUnitId;
        if (portingRequest.status.toUpperCase() === "CONFIRMED") {
          if (
            differenceInDays(
              new Date(dateUtils.formatDate(portingRequest.desiredDueDate)),
              new Date(dateUtils.formatDate(new Date()))
            ) <= 1
          ) {
            throw genericError({
              status: 403,
              code: 403,
              errors: [
                {
                  code: 10011,
                  message: ERROR_CODES[10011]
                }
              ]
            });
          }
        }
        let data = await espressoService.makeSOAPRequest(
          "lnpCancelPon",
          params
        );
        const $ = cheerio.load(data, {
          xmlMode: true
        });
        const lnpCancelPonResponse = $("lnpCancelPonResponse");
        const parsedError = lnpCancelPonResponse.find("errors");
        if (parsedError && parsedError.children().length) {
          const errors = parsedError
            .children()
            .toArray()
            .map(child => {
              const code = $(child)
                .find("code")
                .text();
              const message = $(child)
                .find("message")
                .text();
              return {
                code,
                message
              };
            });
          throw genericError({
            message: "Cancel Porting Request failed.",
            status: 500,
            code: 500,
            errors
          });
        }

        const status = "Pending Cancellation";
        query = `UPDATE porting SET status = ?, requestDate = ? WHERE businessUnitId = ? AND requestId = ?`;
        values = [
          status,
          requestDate,
          params.businessUnit.businessUnitId,
          params.requestId
        ];
        const updatePortingResponse = await connection.query(query, values);
        portingRequest.status = status;
        delete portingRequest.businessUnit;
        delete portingRequest.businessUnitId;
        const previous = compareJSON(portingRequest, original);
        data = Object.assign({}, portingRequest);
        data.previous = previous;
        try {
          await webHookService.send({
            event: "porting_request.updated",
            payload: data,
            businessUnit: params.businessUnit
          });
        } catch (e) {
          logger.error(e);
        }

        // delete portingRequest.accountId;
        delete portingRequest.businessUnit;
        return portingRequest;
      } else {
        throw genericError({
          status: 403,
          code: 403,
          errors: [
            {
              code: 10012,
              message: ERROR_CODES[10012]
            }
          ]
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PortingManager cancelPortRequest took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get the port request details for specified request id.
   *
   * @param {object} params
   * {
   *    @param {string} requestId(optional)  The request id of the porting request to retrieve.
   *    @param {string} serviceId(optional) Filter by serviceId.
   *    @param {string} accountId(optional) Filter by accountId.
   *    @param {string} telephoneNumber(optional) Filter by telephoneNumber.
   *    @param {string} requestDate(optional) Filter by requestDate. Format: YYYY-MM-DD
   *    @param {stirng} desiredDueDate(optional) Filter by desiredDueDate. Format: YYYY-MM-DD
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  async getPortRequests(params = {}) {
    logger.info("PortingManager getPortRequests");
    const _timeStart = process.hrtime();
    if (
      !params ||
      !params.businessUnit ||
      (params.businessUnit &&
        typeof params.businessUnit.businessUnitId === "undefined")
    ) {
      throw genericError({
        message:
          "Get porting requests failed due to: Required businessUnit/businessUnitId is missing.",
        status: 400,
        code: 400
      });
    }
    let connection = null;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT * FROM porting WHERE businessUnitId = ?`;
      let values = [params.businessUnit.businessUnitId];
      if (typeof params.requestId !== "undefined") {
        query += ` AND requestId = ?`;
        values.push(params.requestId);
      } else {
        if (params.serviceId) {
          query += ` AND serviceId = ?`;
          values.push(params.serviceId);
        }
        if (params.accountId) {
          query += ` AND accountId = ?`;
          values.push(params.accountId);
        }
        if (params.telephoneNumber) {
          query += ` AND telephoneNumber = ?`;
          values.push(params.telephoneNumber);
        }
        if (params.requestDate) {
          query += ` AND requestDate >= ?`;
          values.push(params.requestDate);
        }
        if (params.desiredDueDate) {
          query += ` AND desiredDueDate >= ?`;
          values.push(params.desiredDueDate);
        }
      }
      query += ` ORDER BY requestDate ASC`;

      const portingRowsResponse = await connection.query(query, values);
      let portingRequests = (portingRowsResponse[0] || []).map(portingRow => {
        return {
          requestId: portingRow.requestId,
          status: portingRow.status,
          requestDate: portingRow.requestDate,
          telephoneNumber: portingRow.telephoneNumber,
          providerName: portingRow.providerName,
          providerAccountNumber: portingRow.providerAccountNumber,
          desiredDueDate: portingRow.desiredDueDate,
          serviceType: portingRow.serviceType,
          fullName: portingRow.fullName,
          streetNumber: portingRow.streetNumber,
          streetName: portingRow.streetName,
          unitNumber: portingRow.unitNumber,
          city: portingRow.city,
          province: portingRow.province,
          postalCode: portingRow.postalCode,
          comments: portingRow.comments,
          statusReason: portingRow.statusReason,
          note: portingRow.note,
          serviceId: portingRow.serviceId,
          accountId: portingRow.accountId
        };
      });
      if (typeof params.requestId !== "undefined") {
        return portingRequests[0] || {};
      }
      return {
        requests: portingRequests
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PortingManager getPortRequests took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  //for testing purposes only
  async updatePortRequestStatus(params = {}) {
    logger.info("PortingManager updatePortRequestStatus");
    const _timeStart = process.hrtime();
    try {
      const data = await espressoService.makeSOAPRequest(
        "lnpPonChangeStatus",
        params
      );
      const $ = cheerio.load(data, {
        xmlMode: true
      });
      const lnpPonChangeStatusResponse = $("lnpPonChangeStatus");
      const parsedError = lnpPonChangeStatusResponse.find("errors");
      if (parsedError && parsedError.children().length) {
        const errors = parsedError
          .children()
          .toArray()
          .map(child => {
            const code = $(child)
              .find("code")
              .text();
            const message = $(child)
              .find("message")
              .text();
            return {
              code,
              message
            };
          });
        throw genericError({
          message: "Cancel Porting Request failed.",
          status: 500,
          code: 500,
          errors
        });
      }
      return {};
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `PortingManager updatePortRequestStatus took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
