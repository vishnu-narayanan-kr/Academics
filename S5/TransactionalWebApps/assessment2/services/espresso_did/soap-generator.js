"use strict";

const logger = require("./../../logger")(module);

/**
 * Class that generates the Espresso DID SOAP body requests.
 */
module.exports = {
  /**
   * Check if npanxx is portable
   *
   * @param {object} params
   * {
   *    @param {string} npanxx(required)  The areaCode and exchangeCode.
   * }
   */
  lnpCheckNpaNxxPortability(params) {
    logger.info("Espresso DID lnpCheckNpaNxxPortability");
    return `<npanxx>${params.npanxx}</npanxx>`;
  },

  /**
   * Cancel a porting request
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request id of the porting request to cancel.
   * }
   */
  lnpCancelPon(params) {
    logger.info("Espresso DID lnpCancelPon");
    return `<pon>${params.requestId}</pon>`;
  },

  /**
   * Get details of a porting request
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request id of the porting request to get details for.
   * }
   */
  lnpPonLastStatus(params) {
    logger.info("Espresso DID lnpPonLastStatus");
    return `<pon>${params.requestId}</pon>`;
  },

  /**
   * Get porting request details from specified date range
   *
   * @param {object} params
   * {
   *    @param {string} startDate(required)  The start date of range. Format: YYYY-MM-DD
   *    @param {string} endDate(required)  The end date of range. Format: YYYY-MM-DD
   * }
   */
  lnpGetReport(params) {
    logger.info("Espresso DID lnpGetReport");
    return `<startDate>${params.startDate}</startDate>
            <endDate>${params.endDate}</endDate>`;
  },

  /**
   * Get porting request details from telephoneNumber
   *
   * @param {object} params
   * {
   *    @param {string} telephoneNumber(required)  The telephoneNumber of the porting request to get details for.
   * }
   */
  lnpPonInfoForTelNumber(params) {
    logger.info("Espresso DID lnpPonInfoForTelNumber");
    return `<number>${params.telephoneNumber}</number>`;
  },

  /**
   * Change the porting request status
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request Id of the pon to change the status for.
   *    @param {string} status(required)  The new status of the pon.
   * }
   */
  lnpPonChangeStatus(params) {
    logger.info("Espresso DID lnpPonChangeStatus");
    return `<pon>${params.requestId}</pon>
            <status>${params.status}</status>`;
  },

  /**
   * Get all porting request statuses from date
   *
   * @param {object} params
   * {
   *    @param {string} date(required)  The date to get all porting requests from.
   * }
   */
  lnpPonsStatusFromDate(params) {
    logger.info("Espresso DID lnpPonsStatusFromDate");
    return `<date>${params.date}</date>`;
  },

  /**
   * Create porting request
   *
   * @param {object} params
   * {
   *    @param {string} telephoneNumber(required)  The telephone number to be transferred from the existing provider (losing carrier).
   *    @param {string} providerName(required)  The Provider that currently hosts the Telephone Number that the Account Holder wishes to Port-In. This is also known as the losing carrier.
   *    @param {string} providerAccountNumber(required)  The Account Number associated with the existing provider and telephone number that is to be ported-in. 
   *       This must match the existing provider's records or the transfer request will be rejected.
   *    @param {String} requestDate(required)  The date the porting request was created.
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
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  lnpCreatePons(params) {
    logger.info("Espresso DID lnpCreatePons");
    return `<data>
              <pon_data>
                <service_type>${params.serviceType}</service_type>
                <current_provider_name>${params.providerName}</current_provider_name>
                <desired_due_date>${params.desiredDueDate}</desired_due_date>
                <auth_date>${params.requestDate}</auth_date>
                <end_user_name>${params.fullName}</end_user_name>
                <house_number>${params.streetNumber}</house_number>
                <street_directional></street_directional>
                <street_name>${params.streetName}</street_name>
                <street_type></street_type>
                <descriptive_location></descriptive_location>
                <floor></floor>
                <room></room>
                <building></building>
                <city>${params.city}</city>
                <province_state>${params.province}</province_state>
                <zip_code>${params.postalCode}</zip_code>
                <comments>${params.comments || ""}</comments>
                <losing_carrier_comments></losing_carrier_comments>
                <service_details>
                  <item>
                    <activity>Port</activity>
                    <existing_account_number>${params.providerAccountNumber}</existing_account_number>
                    <start_number>${params.telephoneNumber}</start_number>
                    <end_number></end_number>
                  </item>
                </service_details>
              </pon_data>
              <routing>
                <default_routing_profile>${params.businessUnit.config.espresso_did.defaultRoutingProfile}</default_routing_profile>
              </routing>
            </data>`;
    /*            
                <default_routing_profile></default_routing_profile>
                <details>
                <item>
                  <start_number></start_number>
                  <end_number></end_number>
                  <routing_profile></routing_profile>
                </item>
              </details>
    */
  },

  /**
   * Update an existing porting request
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request Id of the porting rqeuest to update.
   *    @param {string} telephoneNumber(optional)  The telephone number to be transferred from the existing provider (losing carrier).
   *    @param {string} providerName(optional)  The Provider that currently hosts the Telephone Number that the Account Holder wishes to Port-In. This is also known as the losing carrier.
   *    @param {string} providerAccountNumber(optional)  The Account Number associated with the existing provider and telephone number that is to be ported-in. 
   *       This must match the existing provider's records or the transfer request will be rejected.
   *    @param {String} requestDate(optional)  The date the porting request was created.
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
   *    @param {object} businessUnit(required)  Object describing the business unit needed to call required services.
   * }
   */
  lnpEditPon(params) {
    logger.info("Espresso DID lnpEditPon");
    return `<data>
              <pon>${params.requestId}</pon>
              <pon_data>
                <service_type>${params.serviceType}</service_type>
                <current_provider_name>${params.providerName}</current_provider_name>
                <desired_due_date>${params.desiredDueDate}</desired_due_date>
                <auth_date>${params.requestDate}</auth_date>
                <end_user_name>${params.fullName}</end_user_name>
                <house_number>${params.streetNumber}</house_number>
                <street_directional></street_directional>
                <street_name>${params.streetName}</street_name>
                <street_type></street_type>
                <descriptive_location></descriptive_location>
                <floor></floor>
                <room></room>
                <building></building>
                <city>${params.city}</city>
                <province_state>${params.province}</province_state>
                <zip_code>${params.postalCode}</zip_code>
                <comments>${params.comments || ""}</comments>
                <losing_carrier_comments></losing_carrier_comments>
                <service_details>
                  <item>
                    <activity>Port</activity>
                    <existing_account_number>${params.providerAccountNumber}</existing_account_number>
                    <start_number>${params.telephoneNumber}</start_number>
                    <end_number></end_number>
                  </item>
                </service_details>
              </pon_data>
            </data>`;
  },

  /**
   * Update the desired due date for a confirmed porting request
   *
   * @param {object} params
   * {
   *    @param {string} requestId(required)  The request id of the porting request to get details for.
   *    @param {string} desiredDueDate(required)  The new desired due date.
   *    @param {string} requestDate(optional)  The authorization date.
   * }
   */
  lnpEditDDD(params) {
    logger.info("Espresso DID lnpEditDDD");
    return `<pon>${params.requestId}</pon>
    <desired_due_date>${params.desiredDueDate}</desired_due_date>
    <auth_date>${params.requestDate}</auth_date>`;
  }

};