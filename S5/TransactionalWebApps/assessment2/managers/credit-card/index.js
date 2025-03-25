"use strict";

const debug = require("debug")("manager:credit-card");
const debugTiming = require("debug")("timing");
const logger = require("./../../logger")(module);
const cheerio = require("cheerio");
const { pmgService } = require("./../../services");
const { genericError } = require("./../../utils/error");
const { NS_PER_SEC } = require("./../../utils/constants");

module.exports = {
  /**
   * Add/Update credit card details on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to add/update a credit card for.
   *    @param {string} accountCode(required)  The account code to add/update a credit card for.
   *    @param {object} creditCard(required)
   *    {
   *        @param {string} cardType(required)  The type of credit card, for example VISA. Allowed Values: VISA,
   *          MASTERCARD, AMEX
   *        @param {string} number(required)  The credit card number.
   *        @param {string} holder(required)  The credit card holder's name.
   *        @param {string} expMonth(required)  The credit card expiry month. Ex: '04'.
   *        @param {string} expYear(required)  The credit card expiry year. Ex: '2017'.
   *        @param {string} CVV(required)  The credit card security code. Ex: '104 or '7612'.
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async addCreditCard(params) {
    logger.info("CreditCardManager addCreditCard");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.accountId === "undefined" ||
      typeof params.creditCard === "undefined" ||
      typeof params.accountCode === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "Add credit card failed due to: One of required accountId, accountCode, creditCard and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }
    let cardinfo = null;
    let pmgData = null;
    try {
      try {
        pmgData = await pmgService.makeSOAPRequest(
          "addCreditCard",
          Object.assign(
            {
              businessUnit: params.businessUnit,
              accountId: params.accountId,
              accountCode: params.accountCode
            },
            {
              creditCard: params.creditCard
            }
          )
        );
      } catch (e) {
        // e also has a statusCode property and a response property that also
        // contains both a body and a status code property
        if (e.cause) {
          throw genericError({
            message: `Add credit card failed with reason: ${e.message}.`,
            status: 500,
            code: 500,
            errors: [
              {
                code: (e.error && e.error.code) || "Unknown",
                message: (e.error && e.error.message) || "Unknown"
              }
            ]
          });
        }
        pmgData = e.error;
      }
      const $ = cheerio.load(pmgData, {
        xmlMode: true
      });
      const parsedError = $("ns2\\:WSClientException").length;
      if (parsedError) {
        const code = $("code").text();
        const message = $("message").text();
        throw genericError({
          message: `Add credit card failed with reason: ${message}.`,
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
      const faultcode = $("faultcode").text();
      const faultstring = $("faultstring").text();
      if (faultcode) {
        throw genericError({
          message: `Add credit card failed with reason: ${faultstring}.`
        });
      }

      const status = $("cardStatus").text();
      const code = $("cardTypeCode").text();
      const description = $("cardTypeDescr").text();
      const expMonth = $("expMonth").text();
      const holder = $("holder").text();
      const expYear = $("expYear").text();
      const number = $("maskedCardNumber").text();
      const token = $("token").text();
      cardinfo = {
        status,
        code,
        description,
        holder,
        expMonth,
        expYear,
        number,
        token
      };
      return cardinfo;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `CreditCardManager addCreditCard took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
