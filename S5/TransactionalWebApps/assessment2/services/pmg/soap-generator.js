"use strict";

const logger = require("./../../logger")(module);

/**
 * Class that generates the MindBill PMG SOAP body requests.
 */
module.exports = {
  /**
   * Add a credit card.
   *
   * @param {object} params
   * {
   *    @param {string} accountCode(required)
   *    @param {object} businessUnit(required)
   *    @param {object} creditCard(required)
   *    {
   *        @param {string} number(required)
   *        @param {string} cardType(required)
   *        @param {string} CVV(required)
   *        @param {string} expMonth(required)
   *        @param {string} expYear(required)
   *        @param {string} holder(required)
   *    }
   * }
   */
  addCreditCard(params) {
    logger.info("PMG SOAP addCreditCard");
    return `<accountCode>${params.accountCode}</accountCode>
      <cardNumber>${params.creditCard.number}</cardNumber>
      <cardStatus>ACTIVE</cardStatus>
      <cardType>${params.creditCard.cardType}</cardType>
      <cvv>${params.creditCard.CVV}</cvv>
      <expMonth>${params.creditCard.expMonth}</expMonth>
      <expYear>${params.creditCard.expYear}</expYear>
      <holder>${params.creditCard.holder}</holder>
      <prefixLength>0</prefixLength>
      <provider>${params.businessUnit.config.mind.masterAccount.provider.code}</provider>
      <sufixLength>4</sufixLength>`;
  },

  /**
   * Close a credit card.
   *
   * @param {object} params
   * {
   *
   * }
   */
  closeCreditCard(params) {
    logger.info("PMG SOAP closeCreditCard");
    return ``;
  },

  /**
   * Get a credit card.
   *
   * @param {object} params
   * {
   *
   * }
   */
  getCreditCard(params) {
    logger.info("PMG SOAP getCreditCard");
    return ``;
  },

  /**
   * Update expiration date of a credit card.
   *
   * @param {object} params
   * {
   *
   * }
   */
  updateExpirationDate(params) {
    logger.info("PMG SOAP updateExpirationDate");
    return ``;
  },

  /**
   * Set security code of a credit card.
   *
   * @param {object} params
   * {
   *
   * }
   */
  setSecurityCode(params) {
    logger.info("PMG SOAP setSecurityCode");
    return ``;
  },

  /**
   * Update account code of a credit card.
   *
   * @param {object} params
   * {
   *
   * }
   */
  updateCCAccountCode(params) {
    logger.info("PMG SOAP updateCCAccountCode");
    return ``;
  },

  /**
   * Get account code of a credit card.
   *
   * @param {object} params
   * {
   *
   * }
   */
  getAccountCode(params) {
    logger.info("PMG SOAP getAccountCode");
    return ``;
  }
};