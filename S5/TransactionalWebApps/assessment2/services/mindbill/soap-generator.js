"use strict";

const logger = require("./../../logger")(module);

/**
 * Class that generates the MindBill SOAP body requests.
 */
module.exports = {
  /**
   * Create account information.
   *
   * @param {object} account
   * {
   *    @param {boolean} isLegacy(optional)  if this account should be treated as legacy.
   *    @param {string} code(required)  The account code associated with this account.
   *    @param {string} parentId(optional)  The parent account id associated with this account.
   *    @param {string} billingType(optional)  The type of billing for this account (postpaid or prepaid)
   *    @param {string} name(optional)  The account name associated with this account.
   *        Will default to 'contact.fname contact.lname'.
   *    @param {object} billing(optional)  The billing details.
   *    {
   *        @param {boolean} billable(required) if the account is biilable or not
   *        @param {string} cycle(required)  When to bill
   *    }
   *    @param {string} defaultCreditScore(optional)
   *    @param {object} agent(optional)  The agent associated with the creation of this account.
   *    {
   *        @param {string} agentId(required)
   *        @param {string} commissionCode(required)
   *    }
   *    @param {string} type(optional)  The account type.
   *    {
   *        @param {integer} type(required)
   *        @param {boolean} correlate_status_with_balance(optional)
   *        @param {boolean} use_own_lc_functionality(optional)
   *    }
   *    @param {object} status(optional)  The service status associated with this account.
   *    {
   *        @param {integer} code(required)
   *        @param {integer} reason(optional)
   *        @param {integer} sub_reason(optional)
   *    }
   *    @param {object} shipment(required)  The shipment config associated with this account.
   *    {
   *        @param {string} presentation_format(required)
   *        @param {integer} reason(optional)
   *        @param {integer} sub_reason(optional)
   *    }
   *    @param {object} provider(optional)
   *    {
   *        @param {string} code(required)
   *    }
   *    @param {object} product(optional)
   *    {
   *        @param {string} planCode(required)
   *    }
   *    @param {object} contract(optional)
   *    {
   *        @param {integer} length(required) in months
   *        @param {string} startDate(optional) In format YYYYMMDD
   *    }
   *    @param {object} class(required)
   *    {
   *    }
   *    @param {object} contact(required)
   *    {
   *        @param {string} fname(optional)  The first name of the account holder.
   *        @param {string} lname(optional)  The last name of the account holder.
   *        @param {string} address1(required)  The primary mailing addresss of the account holder's billing address.
   *        @param {string} address2(optional)
   *        @param {string} address3(optional)
   *        @param {string} city(optional)  The city of the account holder's billing address.
   *        @param {string} province(optional)  The province of the account holder's billing address.
   *           Accepts 2-character abbreviated code, for example ON (Ontario).
   *        @param {string} country(optional)  The country of the account holder's billing address.
   *           Accepts 2-character abbreviated code, for example US (United States)
   *        @param {string} postalCode(optional)  The postal code of the account holder's billing address.
   *        @param {object} phone(optional)
   *        {
   *            @param {string} home(optional) The home phone number to contact the account holder.
   *            @param {string} business(optional) The business phone number to contact the account holder.
   *            @param {string} mobile(optional) The mobile phone number to contact the account holder.
   *        }
   *        @param {string} emailAddress(optional)  The primary email address of the account holder.
   *    }
   *    @param {object} tax(optional)  The tax group associated with this account. Based on province.
   *    {
   *        @param {string} group(optional)
   *    }
   * }
   */
  createAccount(account) {
    logger.info("MindBill SOAP createAccount");
    let nameinfo = ``;
    if (account.name) {
      nameinfo = `<name>${account.name}</name>`;
    }

    let agentinfo = ``;
    if (account.agent) {
      agentinfo += `<agent_list>`;
      agentinfo += `<agent_commission agent_code="${account.agent.agentId}">`;
      agentinfo += `<default code="${account.agent.commissionCode}"/>`;
      agentinfo += `</agent_commission>`;
      agentinfo += `</agent_list>`;
    }

    let typeinfo = ``;
    if (account.type) {
      typeinfo += `<type>`;
      if (typeof account.type.correlate_status_with_balance !== "undefined") {
        typeinfo = `<type correlate_status_with_balance="${!!account.type
          .correlate_status_with_balance}">`;
      } else if (typeof account.type.use_own_lc_functionality !== "undefined") {
        typeinfo = `<type use_own_lc_functionality="${!!account.type.use_own_lc_functionality}">`;
      }
      typeinfo += `${account.type.type}</type>`;
    }

    let classinfo = ``;
    if (account.class) {
      classinfo += `<class>${account.class.class}</class>`;
    }

    let categoryinfo = ``;
    if (typeof account.category !== "undefined") {
      categoryinfo += `<category>${account.category}</category>`;
    }

    let providerinfo = ``;
    if (account.provider) {
      providerinfo += `<provider code="${account.provider.code}"/>`;
    }

    let parentinfo = ``;
    if (account.parentId) {
      parentinfo += `<parent id="${account.parentId}"/>`;
    }

    let creditscoreinfo = ``;
    if (
      account.billing &&
      !!account.billing.billable &&
      account.billingType.toLowerCase() === "postpaid" &&
      account.defaultCreditScore
    ) {
      creditscoreinfo += `<credit_score><code>${
        account.defaultCreditScore
      }</code></credit_score>`;
    }

    let productinfo = ``;
    if (account.product) {
      productinfo += `<product code="${account.product.planCode}"/>`;
    }

    let contractinfo = ``;
    // if (account.contract) {
    //   let startDate = ``;
    //   if (account.contract.startDate) {
    //     startDate = ` start_date="${account.contract.startDate}"`;
    //   }
    //   contractinfo = `<contract length="${account.contract.length}"${startDate}/>`;
    // }

    let sharinginfo = ``;
    if (account.billingType) {
      sharinginfo += `<closed_fub_sharing_group>${account.billingType.toLowerCase() ===
        "postpaid"}</closed_fub_sharing_group>`;
    }

    let statusinfo = ``;
    if (account.status) {
      statusinfo = `<status>`;
      if (typeof account.status.code !== "undefined") {
        statusinfo += `<code>${account.status.code}</code>`;
      }
      statusinfo += `</status>`;
    }

    let taxinfo = ``;
    if (account.tax) {
      taxinfo += `<tax>`;
      if (typeof account.tax.group !== "undefined") {
        taxinfo += `<group>${account.tax.group}</group>`;
      }
      taxinfo += `</tax>`;
    }

    let billableinfo = ``;
    if (account.billing) {
      billableinfo += `<billing>`;
      if (typeof account.billing.billable !== "undefined") {
        billableinfo += `<billable>${account.billing.billable}</billable>`;
      }
      if (typeof account.billing.cycle !== "undefined") {
        billableinfo += `<cycle>${account.billing.cycle}</cycle>`;
      }
      if (typeof account.billing.dc_path_code !== "undefined") {
        billableinfo += `<dc_path_code>${account.billing.dc_path_code}</dc_path_code>`;
      }
      billableinfo += `</billing>`;
    }

    let shipmentinfo = ``;
    if (account.shipment) {
      shipmentinfo += `<shipment>`;
      shipmentinfo += `<presentation_format>${
        account.shipment.presentation_format
      }</presentation_format>`;
      shipmentinfo += `<contact>1</contact>`;
      shipmentinfo += `<ship_email>true</ship_email>`;
      shipmentinfo += `</shipment>`;
    }
    let contactinfo = `<contact_list>`;
    contactinfo += `<contact invoice="true" primary="true">`;
    if (account.contact.fname || account.contact.lname) {
      contactinfo += `<name>`;
      if (account.contact.lname) {
        contactinfo += `<last>${account.contact.lname}</last>`;
      }
      if (account.contact.fname) {
        contactinfo += `<first>${account.contact.fname}</first>`;
      }
      contactinfo += `</name>`;
    }
    if (account.contact.address1 || account.contact.address2 || account.contact.address3) {
      contactinfo += `<address>`;
      if (account.contact.address1) {
        contactinfo += `<line1>${account.contact.address1}</line1>`;
      }
      if (account.contact.address2) {
        contactinfo += `<line2>${account.contact.address2}</line2>`;
      }
      if (account.contact.address3) {
        contactinfo += `<line3>${account.contact.address3}</line3>`;
      }
      contactinfo += `</address>`;
    }
    if (account.contact.city) {
      contactinfo += `<city>${account.contact.city}</city>`;
    }
    if (account.contact.province) {
      contactinfo += `<state>${account.contact.province}</state>`;
    }
    if (account.contact.postalCode) {
      contactinfo += `<zip>${account.contact.postalCode}</zip>`;
    }
    if (account.contact.country) {
      contactinfo += `<country>${account.contact.country}</country>`;
    }
    if (account.contact.phone && Object.keys(account.contact.phone).length) {
      contactinfo += `<phone>`;
      if (typeof account.contact.phone.home !== "undefined") {
        contactinfo += `<home>${account.contact.phone.home}</home>`;
      }
      if (typeof account.contact.phone.business !== "undefined") {
        contactinfo += `<business>${account.contact.phone.business}</business>`;
      }
      if (typeof account.contact.phone.mobile !== "undefined") {
        contactinfo += `<mobile>${account.contact.phone.mobile}</mobile>`;
      }
      contactinfo += `</phone>`;
    }
    if (account.contact.emailAddress) {
      contactinfo += `<email>${account.contact.emailAddress}</email>`;
    }
    contactinfo += `<contact_type>AUTHUSER</contact_type></contact>`;
    contactinfo += `</contact_list>`;

    let advancedinfo = ``;
    if (account.parentId && !account.isLegacy) {
      advancedinfo += `<advanced><field code="IRISTELX">true</field></advanced>`;
    }

    //TODO:  MINDCODE remove <code> element
    // <code>${account.code}</code>
    return `<account>
            ${nameinfo}
            ${typeinfo}
            ${classinfo}
            ${categoryinfo}
            ${providerinfo}
            ${parentinfo}
            <billing_account id="-1"></billing_account>
            ${creditscoreinfo}
            ${productinfo}
            ${contractinfo}
            ${sharinginfo}
            ${statusinfo}        
            ${taxinfo}
            ${billableinfo}
            ${contactinfo}
            ${shipmentinfo}
            ${advancedinfo}
            ${agentinfo}
          </account>`;
  },

  /**
   * Update account information.
   *
   * @param {object} account
   * {
   *    @param {string} accountId(required)  The account id associated with this account.
   *    @param {string} billingType(optional)  The type of billing for this account (postpaid or prepaid)
   *    @param {string} name(optional)  The account name associated with this account.
   *    @param {object} status(optional)  The service status associated with this account.
   *    {
   *        @param {integer} code(required)
   *        @param {integer} reason(optional)
   *        @param {integer} sub_reason(optional)
   *    }
   *    @param {object} contact(optional)
   *    {
   *        @param {string} contactId(required)  The primary contact id associated with this account.
   *        @param {boolean} invoice(optional)  'true' if this is the contact to invoice for this account.
   *        @param {boolean} primary(optional)  'true' if this is the primary contact for this account.
   *        @param {string} fname(optional)  The first name of the account holder.
   *        @param {string} lname(optional)  The last name of the account holder.
   *        @param {string} address1(optional)  The primary mailing addresss of the account holder's billing address.
   *        @param {string} address2(optional)
   *        @param {string} address3(optional)
   *        @param {string} city(optional)  The city of the account holder's billing address.
   *        @param {string} province(optional)  The province of the account holder's billing address.
   *           Accepts 2-character abbreviated code, for example ON (Ontario).
   *        @param {string} country(optional)  The country of the account holder's billing address.
   *           Accepts 2-character abbreviated code, for example US (United States)
   *        @param {string} postalCode(optional)  The postal code of the account holder's billing address.
   *        @param {object} phone(optional)
   *        {
   *            @param {string} home(optional) The home phone number to contact the account holder.
   *            @param {string} business(optional) The business phone number to contact the account holder.
   *            @param {string} mobile(optional) The mobile phone number to contact the account holder.
   *        }
   *        @param {string} emailAddress(optional)  The primary email address of the account holder.
   *    }
   *    @param {object} tax(optional)  The tax group associated with this account. Based on province.
   *    {
   *        @param {string} group(optional)
   *    }
   *    @param {object} product(optional)
   *    {
   *        @param {string} planCode(required)
   *    }
   *    @param {object} contract(optional)
   *    {
   *        @param {integer} length(required) in months
   *        @param {string} startDate(optional) In format YYYYMMDD
   *    }
   *    @param {object} automaticPayment(optional) Object describing the automatic payment details.
   *    {
   *        @param {boolean} onDeclineSuspend(optional)  If true, suspends account on rejection.
   *        @param {boolean} enabled(optional)  If true, activates automatic payments for this account.
   *        @param {string} paymentType(optional)  The type of payment that will be made when an automatic payment is
   *            triggered. (Required if enabled flag is set to true).
   *        @param {object} onDaysAvailable(optional) Object describing the payment details on remaining days available.
   *        {
   *            @param {boolean} enabled(optional)  If true, triggers an automatic payment when the amount of days
   *                remaining in this account's subscription drops below a specific threshold.
   *            @param {integer} trigger(optional)  The threshold for the amount of days to trigger an automatic payment.
   *                If set to 1, will trigger an automatic payment when there is 1 or fewer days remaining in the
   *                account's subscription.
   *            @param {number} amount(optional)  If days available trigger conditions are met, the payment amount that
   *                is debited to the stored payment method associated with the account.
   *        }
   *        @param {object} onDayOfMonth(optional) Object describing the payment details on a specific day of month. {
   *        {
   *            @param {boolean} enabled(optional)  If true, triggers an automatic payment on a specific day of the month.
   *            @param {integer} trigger(optional)  The threshold for the day of month to trigger an automatic payment.
   *                If set to 15, will trigger an automatic payment on the 15th day of every month.
   *            @param {number} amount(optional)  If day of month trigger conditions are met, the payment amount that is
   *                debited to the stored payment method associated with the account.
   *        }
   *        @param {object} onBalanceBelow(optional) Object describing the payment details on a balance threshold. {
   *        {
   *            @param {boolean} enabled(optional)  If true, triggers an automatic payment when the account balance falls
   *                below a specified threshold (balance).
   *            @param {integer} trigger(optional)  The threshold for the balance to trigger an automatic payment.
   *                If set to 2, will trigger an automatic payment when there is $2 or less remaining in the account's
   *                balance.
   *            @param {number} amount(optional)  If day of month trigger conditions are met, the payment amount that is
   *                debited to the stored payment method associated with the account.
   *        }
   *        @param {object} creditCard(optional)
   *        {
   *            @param {string} cardType(required)  The type of credit card, for example VISA. Allowed Values: VISA,
   *                MASTERCARD, AMEX
   *            @param {string} number(required)  The credit card number.
   *            @param {string} holder(required)  The credit card holder's name.
   *            @param {string} expMonth(required)  The credit card expiry month. Ex: '04'.
   *            @param {string} expYear(required)  The credit card expiry year. Ex: '17'.
   *            @param {string} CVV(required)  The credit card security code. Ex: '104 or '7612'.
   *        }
   *    }
   *    @param {object} shipment(optional)  The shipment config associated with this account.
   *    {
   *        @param {string} presentation_format(required)
   *        @param {integer} reason(optional)
   *        @param {integer} sub_reason(optional)
   *    }
   * }
   */
  updateAccount(account) {
    logger.info("MindBill SOAP updateAccount");
    let nameinfo = ``;
    if (account.name) {
      nameinfo = `<name>${account.name}</name>`;
    }

    let productinfo = ``;
    if (account.product) {
      productinfo = `<product code="${account.product.planCode}"/>`;
    }

    let contractinfo = ``;
    if (account.contract) {
      let startDate = ``;
      if (account.contract.startDate) {
        startDate = ` start_date="${account.contract.startDate}"`;
      }
      contractinfo = `<contract length="${account.contract.length}"${startDate}/>`;
    }

    let sharinginfo = ``;
    if (account.billingType) {
      sharinginfo += `<closed_fub_sharing_group>${account.billingType ===
        "postpaid"}</closed_fub_sharing_group>`;
    }

    let statusinfo = ``;
    if (account.status) {
      statusinfo = `<status bypass_status_locks="true">`;
      if (typeof account.status.code !== "undefined") {
        statusinfo += `<code>${account.status.code}</code>`;
      }
      statusinfo += `</status>`;
    }

    let taxinfo = ``;
    if (account.tax) {
      taxinfo += `<tax>`;
      if (typeof account.tax.group !== "undefined") {
        taxinfo += `<group>${account.tax.group}</group>`;
      }
      taxinfo += `</tax>`;
    }

    let billableinfo = ``;
    if (account.billing) {
      billableinfo += `<billing>`;
      if (typeof account.billing.billable !== "undefined") {
        billableinfo += `<billable>${account.billing.billable}</billable>`;
      }
      if (typeof account.billing.cycle !== "undefined") {
        billableinfo += `<cycle>${account.billing.cycle}</cycle>`;
      }
      billableinfo += `<payment_terms><use_provider_default>true</use_provider_default></payment_terms>`;
      billableinfo += `</billing>`;
    }

    let operationinfo = ``;
    if (account.contact) {
      operationinfo = `<operations>`;
    }

    let contactinfo = ``;
    if (account.contact) {
      if (account.contact.contactId) {
        contactinfo += `<update><contact_list><contact id="${account.contact.contactId}">`;
      } else {
        contactinfo += `<add><contact_list><contact invoice="${!!account.contact
          .invoice}" primary="${!!account.contact.primary}">`;
      }
      if (account.contact.lname || account.contact.fname) {
        contactinfo += `<name>`;
        if (account.contact.lname) {
          contactinfo += `<last>${account.contact.lname}</last>`;
        }
        if (account.contact.fname) {
          contactinfo += `<first>${account.contact.fname}</first>`;
        }
        contactinfo += `</name>`;
      }
      if (
        typeof account.contact.address1 !== "undefined" ||
        typeof account.contact.address2 !== "undefined" ||
        typeof account.contact.address3 !== "undefined"
      ) {
        contactinfo += `<address>`;
        if (typeof account.contact.address1 !== "undefined") {
          contactinfo += `<line1>${account.contact.address1}</line1>`;
        }
        if (typeof account.contact.address2 !== "undefined") {
          if (account.contact.address2) {
            contactinfo += `<line2>${account.contact.address2}</line2>`;
          } else {
            contactinfo += `<line2></line2>`;
          }
        }
        if (typeof account.contact.address3 !== "undefined") {
          if (account.contact.address3) {
            contactinfo += `<line3>${account.contact.address3}</line3>`;
          } else {
            contactinfo += `<line3></line3>`;
          }
        }
        contactinfo += `</address>`;
      }
      if (account.contact.city) {
        contactinfo += `<city>${account.contact.city}</city>`;
      }
      if (account.contact.province) {
        contactinfo += `<state>${account.contact.province}</state>`;
      }
      if (account.contact.postalCode) {
        contactinfo += `<zip>${account.contact.postalCode}</zip>`;
      }
      if (account.contact.country) {
        contactinfo += `<country>${account.contact.country}</country>`;
      }
      if (account.contact.phone && Object.keys(account.contact.phone).length) {
        contactinfo += `<phone>`;
        if (typeof account.contact.phone.home !== "undefined") {
          contactinfo += `<home>${account.contact.phone.home}</home>`;
        }
        if (typeof account.contact.phone.business !== "undefined") {
          contactinfo += `<business>${account.contact.phone.business}</business>`;
        }
        if (typeof account.contact.phone.mobile !== "undefined") {
          contactinfo += `<mobile>${account.contact.phone.mobile}</mobile>`;
        }
        contactinfo += `</phone>`;
      }
      if (account.contact.emailAddress) {
        contactinfo += `<email>${account.contact.emailAddress}</email>`;
      }
      if (account.contact.contactId) {
        contactinfo += `</contact></contact_list></update>`;
      } else {
        contactinfo += `</contact></contact_list></add>`;
      }
    }

    if (account.contact) {
      operationinfo += `${contactinfo}`;
    }

    if (account.contact) {
      operationinfo += `</operations>`;
    }

    let automaticpaymentinfo = ``;
    if (account.automaticPayment) {
      automaticpaymentinfo = `<payment_settings>`;
      if (
        typeof account.automaticPayment.enabled !== "undefined" ||
        typeof account.automaticPayment.paymentType !== "undefined" ||
        typeof account.automaticPayment.adapter !== "undefined" ||
        typeof account.automaticPayment.onDeclineSuspend !== "undefined" ||
        account.automaticPayment.onDaysAvailable ||
        account.automaticPayment.onDayOfMonth ||
        account.automaticPayment.onBalanceBelow
      ) {
        if (typeof account.automaticPayment.enabled !== "undefined") {
          automaticpaymentinfo += `<direct enable="${account.automaticPayment.enabled}">`;
        } else {
          automaticpaymentinfo += `<direct>`;
        }
        if (typeof account.automaticPayment.paymentType !== "undefined") {
          automaticpaymentinfo += `<type>${account.automaticPayment.paymentType}</type>`;
        }
        if (typeof account.automaticPayment.adapter !== "undefined") {
          automaticpaymentinfo += `<adapter>${account.automaticPayment.adapter}</adapter>`;
        }
        if (typeof account.automaticPayment.onDeclineSuspend !== "undefined") {
          automaticpaymentinfo += `<suspend_account_on_reject>${
            account.automaticPayment.onDeclineSuspend
          }</suspend_account_on_reject>`;
        }
        if (
          account.automaticPayment.onDaysAvailable ||
          account.automaticPayment.onDayOfMonth ||
          account.automaticPayment.onBalanceBelow
        ) {
          if (account.automaticPayment.onBalanceBelow) {
            automaticpaymentinfo += `<debit_recharge>
                    <amount>${account.automaticPayment.onBalanceBelow.amount}</amount>
                    <threshold>${account.automaticPayment.onBalanceBelow.trigger}</threshold>
                </debit_recharge>`;
          }
          if (account.automaticPayment.onDaysAvailable) {
            automaticpaymentinfo += `<debit_recharge_on_days>
                    <amount>${account.automaticPayment.onDaysAvailable.amount}</amount>
                    <days>${account.automaticPayment.onDaysAvailable.trigger}</days>
                </debit_recharge_on_days>`;
          }
          if (account.automaticPayment.onDayOfMonth) {
            automaticpaymentinfo += `<debit_recharge_on_day_of_month>
                    <amount_day_of_month>${
                      account.automaticPayment.onDayOfMonth.amount
                    }</amount_day_of_month>
                    <day_of_month>${account.automaticPayment.onDayOfMonth.trigger}</day_of_month>
              </debit_recharge_on_day_of_month>`;
          }
          automaticpaymentinfo += `<recharge_event>`;
          automaticpaymentinfo += `<on_invoice_generation>false</on_invoice_generation>`;
          if (account.automaticPayment.onBalanceBelow) {
            automaticpaymentinfo += `<on_remaining_threshold>${
              account.automaticPayment.onBalanceBelow.enabled
            }</on_remaining_threshold>`;
          }
          if (account.automaticPayment.onDaysAvailable) {
            automaticpaymentinfo += `<on_reaching_days>${
              account.automaticPayment.onDaysAvailable.enabled
            }</on_reaching_days>`;
          }
          if (account.automaticPayment.onDayOfMonth) {
            automaticpaymentinfo += `<on_reaching_day_of_month>${
              account.automaticPayment.onDayOfMonth.enabled
            }</on_reaching_day_of_month>`;
          }
          automaticpaymentinfo += `</recharge_event>`;
        }
        automaticpaymentinfo += `</direct>`;
      }
      if (account.automaticPayment.creditCard) {
        if(!!account.automaticPayment.creditCard.delete) {
          automaticpaymentinfo += `<remove_credit_card>true</remove_credit_card>`;
        }
        else {
          automaticpaymentinfo += `<credit_card><token>${
            account.automaticPayment.creditCard.token
          }</token><code description="${account.automaticPayment.creditCard.description}">${
            account.automaticPayment.creditCard.code
          }</code><number>${account.automaticPayment.creditCard.number}</number><expiration><month>${
            account.automaticPayment.creditCard.expMonth
          }</month><year>${account.automaticPayment.creditCard.expYear}</year></expiration><holder>${
            account.automaticPayment.creditCard.holder
          }</holder></credit_card>`;
        }
      }
      automaticpaymentinfo += `</payment_settings>`;
    }

    let shipmentinfo = ``;
    if (account.shipment) {
      shipmentinfo += `<shipment>`;
      shipmentinfo += `<presentation_format>${
        account.shipment.presentation_format
      }</presentation_format>`;
      shipmentinfo += `<contact>${account.contact.contactId}</contact>`;
      shipmentinfo += `<ship_email>true</ship_email>`;
      shipmentinfo += `</shipment>`;
    }

    return `<account id="${account.accountId}">
            ${nameinfo}
            ${productinfo}
            ${contractinfo}
            ${sharinginfo}            
            ${statusinfo}        
            ${taxinfo} 
            ${billableinfo}
            ${automaticpaymentinfo}
            ${shipmentinfo}
            ${operationinfo} 
          </account>`;
  },

  /**
   * Get account information for the specified account id.
   *
   * @param {object} account
   * {
   *    @param {string} accountId(required)  The account id to retrieve details for.
   * }
   */
  getAccount(account) {
    logger.info("MindBill SOAP getAccount");
    return `<account id="${account.accountId}" detail_level="FULL"/>`;
  },

  /**
   * Get invoices for a particular account/service.
   *
   * @param {object} invoices
   * {
   *    @param {string} accountId(required)  The account/service to get the invoice for.
   *    @param {integer} status(optional)  Use 0 for Open (not paid) or 2 for Closed (paid). If not supplied, request
   *        will return both open and closed invoices.  Allowed Values: 0, 2
   *    @param {object} filters(required) The filter object to use. {
   *        @param {string} fromDate(optional) In format YYYYMMDD
   *        @param {string} toDate(optional) In format YYYYMMDD
   *    }
   * }
   */
  getInvoices(invoices) {
    logger.info("MindBill SOAP getInvoices");
    let statusinfo = ``;
    if (typeof invoices.status !== "undefined") {
      statusinfo = `<invoice status="${invoices.status}"/>`;
    }
    let filterinfo = ``;
    if (invoices.filters && Object.keys(invoices.filters).length) {
      if (invoices.filters.fromDate || invoices.filters.toDate) {
        filterinfo = `<filter `;
        if (invoices.filters.fromDate) {
          filterinfo += `from_date="${invoices.filters.fromDate}"`;
        }
        if (invoices.filters.toDate) {
          filterinfo += ` to_date="${invoices.filters.toDate}"`;
        }
        filterinfo += `/>`;
      }
    }
    return `<account code="${invoices.accountId}"/>
      ${statusinfo}
      ${filterinfo}`;
  },

  /**
   * Get specified invoice for a particular account/service.
   *
   * @param {object} invoice
   * {
   *    @param {string} invoiceId(required)  The invoice to retireve.
   * }
   */
  getInvoice(invoice) {
    logger.info("MindBill SOAP getInvoice");
    return `<invoice>
      <id>${invoice.invoiceId}</id>
    </invoice>`;
  },

  /**
   * Make payment on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to make a payment for.
   *    @param {string} paymentMethod (required) A string representing the method of payment that was made.
   *    @param {string} reference (optional) A unique reference associated with the transaction provider specific to the *
   *        payment.
   *    @param {string} remark (optional) A general text remark regading this payment.
   *    @param {boolean} isServicePayment (optional) Boolean to indicate if payment is for service. ONLY for PIA accounts.
   *    @param {number} amount(required)  The amount of the payment to be applied to the account.
   *    @param {string} currency(required)  The currency of the payment to be applied to the account.
   *            For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php.
   *    @param {boolean} taxesIncluded(required)  If set to true the amount will be recorded as taxes included,
   *            if set to false the amount will be recorded before taxes.
   * }
   */
  addPayment(params) {
    logger.info("MindBill SOAP addPayment");

    let referenceinfo = ``;
    if (params.reference) {
      referenceinfo = `<reference_id>${params.reference}</reference_id>`;
    }
    let remarkinfo = ``;
    if (params.remark) {
      remarkinfo = `<remark>${params.remark}</remark>`;
    }
    let methodinfo = ``;
    if (params.paymentMethod === "CASH") {
      methodinfo = `<cash></cash>`;
    } else {
      methodinfo = `<user_defined code="${params.paymentMethod}"></user_defined>`;
    }
    return `<account code="${params.accountId}">
            <payment tax_included="${
              params.taxesIncluded
            }" is_service_payment="${!!params.isServicePayment}">
              <currency curr_alpha_code="${params.currency}"/>
              <amount>${params.amount}</amount>
              <method>
                ${methodinfo}
              </method>
              ${remarkinfo}
              ${referenceinfo}
            </payment>
          </account>`;
  },

  /**
   * Delete account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to delete
   * }
   */
  deleteAccount(params) {
    logger.info("MindBill SOAP deleteAccount");
    //place after account if we want to bypass checks
    //<force_deleting/>
    return `<account id="${params.accountId}"/>`;
  },

  /**
   * Cancel payment on specfied account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id to cancel a payment for.
   *    @param {string} paymentId (required) A string representing the payment id to cancel.
   * }
   */
  cancelPayment(params) {
    logger.info("MindBill SOAP cancelPayment");
    return `<payment id="${params.paymentId}" force="true"></payment>`;
  },
  /**
   * Generate SOAP body for get balance operation.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to get the balance for.
   * }
   */
  getBalance(params) {
    logger.info("MindBill SOAP getBalance");
    return `<account code="${params.accountId}"/>`;
  },

  /**
   * Generate SOAP body for get payments operation.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to get the payments for.
   *    @param {object} filters(required) The filter object to use. {
   *        @param {string} fromDate(optional)  The starting date to get the payments for.
   *        @param {string} toDate(optional)  The ending date to get the payments for.
   *        @param {string} reference(optional)  The reference id to get the payment for.
   *    }
   * }
   */
  getPaymentList(params) {
    logger.info("MindBill SOAP getPaymentList");
    let filterinfo = ``;
    if (params.filters && Object.keys(params.filters).length) {
      if (params.filters.fromDate || params.filters.toDate || params.filters.reference) {
        filterinfo = `<filter`;
        if (params.filters.fromDate) {
          filterinfo += ` from_date="${params.filters.fromDate}"`;
        }
        if (params.filters.toDate) {
          filterinfo += ` to_date="${params.filters.toDate}"`;
        }
        if (params.filters.reference) {
          filterinfo += ` reference_id="${params.filters.reference}"`;
        }
        filterinfo += `></filter>`;
      }
    }
    return `<account code="${params.accountId}"/>
      ${filterinfo}
    `;
  },

  /**
   * Generate SOAP body for get adjustments operation.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to get the adjustments for.
   *    @param {object} filters(required) The filter object to use. {
   *        @param {string} fromDate(optional)  The starting date to get the adjustments for.
   *        @param {string} toDate(optional)  The ending date to get the adjustments for.
   *    }
   * }
   */
  getAdjustmentList(params) {
    logger.info("MindBill SOAP getAdjustmentList");
    let accountinfo = ``;
    if (params.accountId && params.accountId.length) {
      params.accountId.forEach(account => {
        accountinfo += `<account id="${account}"/>`;
      });
    }
    let filterinfo = ``;
    if (params.filters && Object.keys(params.filters).length) {
      if (params.filters.fromDate || params.filters.toDate) {
        filterinfo = `<filter`;
        if (params.filters.fromDate) {
          filterinfo += ` from_date="${params.filters.fromDate}"`;
        }
        if (params.filters.toDate) {
          filterinfo += ` to_date="${params.filters.toDate}"`;
        }
        filterinfo += `></filter>`;
      }
    }
    return `${accountinfo}
      ${filterinfo}`;
  },

  /**
   * Generate SOAP body for get adjustment operation.
   *
   * @param {object} params
   * {
   *    @param {int} adjustmentId(required)  The adjustment id to get details for.
   * }
   */
  getAdjustment(params) {
    logger.info("MindBill SOAP getAdjustment");
    return `<adjustment id="${params.adjustmentId}"/>`;
  },

  /**
   * Generate SOAP body for delete adjustment operation.
   *
   * @param {object} params
   * {
   *    @param {int} adjustmentId(required)  The adjustment id to delete.
   * }
   */
  deleteAdjustment(params) {
    logger.info("MindBill SOAP deleteAdjustment");
    return `<adjustment id="${params.adjustmentId}"/>`;
  },

  /**
   * Generate SOAP body for add adjustment operation.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to add the adjustment for.
   *    @param {boolean} bypassValidations(optional)  Boolean to indicate if validations should be bypassed when applying adjustment.
   *    @param {string} type(required)  The type of adjustment.
   *    @param {number} amount(required)  The amont of the adjustment.
   *    @param {string} taxGroup(optional) The tax group of the adjustment.
   *    @param {boolean} taxIncluded(required)  Boolean to indicate if taxes are included applying adjustment.
   *    @param {string} currency(required)  The currency used to apply the adjustment.
   *    @param {string} reference(optional)  A note to accompany the adjustment.
   *    @param {string} date(optional)  The date of the adjustment. Format YYYYMMDD.
   *    @param {boolean} immediate(optional)  Boolean to indicate if adjustment is applied immediately.
   *    @param {string} balanceType(optional)  Specifies if the adjustment balance is "account", "tab" or "money_wallet".
   * }
   */
  addAdjustment(params) {
    logger.info("MindBill SOAP addAdjustment");
    let dateinfo = ``;
    if (params.date) {
      dateinfo = `<date>${params.date}</date>`;
    }
    let taxgroupinfo = ``;
    if (params.taxgroupinfo) {
      taxgroupinfo = `<service_tax_group>${params.taxgroupinfo}</service_tax_group>`;
    }
    let balancetypeinfo = ``;
    if (params.balanceType) {
      balancetypeinfo = `<balance_type><${params.balanceType}/></balance_type>`;
    }
    return `<account code="${params.accountId}">
      <adjustment bypass_remaining_validations="${!!params.bypassValidations}">
        <type>${params.type}</type>
        <amount include_tax="${!!params.taxIncluded}" curr_alpha_code="${params.currency}">${
      params.amount
    }</amount>
        ${taxgroupinfo}
        <note>${params.reference || ""}</note>
        ${dateinfo}
        <immediate_impact_on_balance>${!!params.immediate}</immediate_impact_on_balance>
        ${balancetypeinfo}
        </adjustment>
    </account>`;
  },

  /**
   * Generate SOAP body for get payment operation.
   *
   * @param {object} params
   * {
   *    @param {int} paymentId(required)  The payment id to get details for.
   * }
   */
  getPayment(params) {
    logger.info("MindBill SOAP getPayment");
    return `<payment id="${params.paymentId}"/>`;
  },

  /**
   * Generate SOAP body for get account service details.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The code for the MindBill service account to get the details for.
   *    @param {string} serviceId (required)  The id for the MindBill service account to get the details for.
   *    @param {string} serviceCode(required)  The service code for the MindBill service account.
   * }
   */
  getAccountService(params) {
    logger.info("MindBill SOAP getAccountService");
    return `<account id="${params.accountId}"/>
    <service code="${params.serviceCode}" id="${params.serviceId}" detail_level="FULL"/>`;
  },

  /**
   * Generate SOAP body for get invoice image.
   *
   * @param {object} params
   * {
   *    @param {string} invoiceId(required)  The code for the MindBill invoice to get.
   * }
   */
  getInvoiceImage(params) {
    logger.info("MindBill SOAP getInvoiceImage");
    return `<invoice id="${params.invoiceId}"/>`;
  },

  /**
   * Generate SOAP body for get account service details.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The code for the MindBill service account to get the details for.
   *    @param {boolean} forceGeneration(optional)  Indicates whether to force invoice generation. Defaults to true.
   *    @param {boolean} subtree(optional) Generates invoices for all billable descendants as well. Defaults to false.
   *    @param {array} adjustments(optional) Generates invoice with the provided adjustments included.
   *    @param {object} billing(optional) Object with details about billing.
   *    {
   *      @param {string} endDate(required) Defaults to today.  Format YYYYMMDD.
   *      @param {boolean} includeTransactions(optional) Include transactions until endDate. Default is false.
   *    }
   *    @param {object} paymentTerms(optional) Object with details about the payment terms.
   *    {
   *      @param {string} type(required) The type of payment term
   *      @param {number} days(required) Number of payment terms (starting from invoice generation) or Fixed day
   *          of the month when payment terms are ended -> Depending on "type"
   *    }
   *    @param {boolean} forceShipment(required)  Indicates whether to force the shipment of the invoice. Defaults to false.
   *    @param {number} layout(optional) Invoice layout ID.
   * }
   */
  generateInvoiceOnDemand(params) {
    logger.info("MindBill SOAP generateInvoiceOnDemand");
    let adjustmentsinfo = ``;
    if (params.adjustments && params.adjustments.length > 0) {
      adjustmentsinfo += `<adjustment_instances>`;
      params.adjustments.map(adjustment => {
        adjustmentsinfo += `<adjustment_instance adjustment_instance_id="${adjustment}"/>`;
      });
      adjustmentsinfo += `</adjustment_instances>`;
    }
    let paymenttermsinfo = `<use_default/>`;
    if (params.paymentTerms && typeof params.paymentTerms.type !== "undefined") {
      if (params.paymentTerms.type.toLowerCase() === "default") {
        paymenttermsinfo = `<use_default/>`;
      }
      if (params.paymentTerms.type.toLowerCase() === "daysFrom") {
        paymenttermsinfo = `<days_from_invoice_generation>${
          params.paymentTerms.days
        }</days_from_invoice_generation>`;
      }
      if (params.paymentTerms.type.toLowerCase() === "dayOfMonth") {
        paymenttermsinfo = `<fixed_day_of_month>${params.paymentTerms.days}</fixed_day_of_month>`;
      }
    }

    let layoutinfo = `<use_default/>`;
    if (typeof params.layout !== "undefined") {
      layoutinfo = `<override layout_id="${params.layout}"/>`;
    }
    return `<account code="${params.accountId}"/>
    <invoice>
      <generation force="true">
        <type>
          <real sub_tree="false"/>
        </type>
        <content>
          <services include="false">
          </services>
          <adjustments include="true" include_system_adjustments="true">
          ${adjustmentsinfo}
          </adjustments>
          <goods include="false">
          </goods>
          <no_hard_copy_charge/>
        </content>
        <billing_period invoice_to_date="${
          params.billing.endDate
        }" include_transactions_until_generation_date="${params.billing.includeTransactions}">
        </billing_period>
      </generation>
      <payment_terms>
        ${paymenttermsinfo}
      </payment_terms>
      <shipment force="false"/>
      <layout>
        ${layoutinfo}
      </layout>
    </invoice>`;
  },

  /**
   * Generate SOAP body for get updating a service on an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(optional)  The account code for the MindBill account to update.
   *    @param {string} serviceId(required)  The service id to update.
   *    @param {object} operations(optional)
   *    {
   *      @param {object} update(optional)
   *      {
   *          @param {string} tariffCode(optional)  The tariff/service code to update.
   *          @param {string} recurringCharge(optional)  The recurringCharge to set.
   *      }
   *      @param {object} add(optional)
   *      {
   *          @param {string} tariffCode(optional)  The tariff/service code to update.
   *          @param {string} recurringCharge(optional)  The recurringCharge to set.
   *      }
   *      @param {object} delete(optional)
   *      {}
   *      @param {object} deactivate(optional)
   *      {}
   *    }
   *    @param {object} specfic(optional)
   *    {
   *        @param {object} voip(optional)
   *        {
   *            @param {object} operations(optional)
   *            {
   *                @param {object} add(optional)
   *                {
   *                    @param {array} aniList(optional)
   *                    [{
   *                        @param {string} numberType(required)
   *                        @param {object} range(optional)
   *                        {
   *                            @param {string} from(required)
   *                            @param {string} to(required)
   *                        }
   *                        @param {string} value(optional)
   *                        @param {date} fromDate(optional) format: yyyymmdd HHmmss
   *                        @param {date} toDate(optional) format: yyyymmdd HHmmss
   *                    }]
   *                }
   *                @param {object} update(optional)
   *                {
   *                    @param {array} aniList(optional)
   *                    [{
   *                        @param {integer} group(required)
   *                        @param {string} value(optional)
   *                        @param {object} range(optional)
   *                        {
   *                            @param {string} from(required)
   *                            @param {string} to(required)
   *                        }
   *                        @param {date} fromDate(optional) format: yyyymmdd HHmmss
   *                        @param {date} toDate(optional) format: yyyymmdd HHmmss
   *                    }]
   *                }
   *                @param {object} delete(optional)
   *                {
   *                    @param {array} aniList(optional)
   *                    [
   *                        @param {integer} group(required)
   *                    ]
   *                }
   *            }
   *        }
   *    }
   * }
   */
  updateAccountService(params) {
    logger.info("MindBill SOAP updateAccountService");
    let accountinfo = ``;
    if (params.accountId) {
      // accountinfo += `<account id="${params.accountId}"/>`;
    }
    let specificinfo = ``;
    if (params.specific) {
      specificinfo += `<specific>`;
      if (params.specific.voip) {
        specificinfo += `<voip>`;
        if (params.specific.voip.operations) {
          specificinfo += `<operations>`;
          if (
            params.specific.voip.operations.add &&
            Object.keys(params.specific.voip.operations.add).length
          ) {
            specificinfo += `<add>`;
            if (
              params.specific.voip.operations.add.aniList &&
              params.specific.voip.operations.add.aniList.length
            ) {
              specificinfo += `<ani_list>`;
              params.specific.voip.operations.add.aniList.forEach(elem => {
                specificinfo += `<ani number_type="${elem.numberType}">`;
                if (elem.range) {
                  specificinfo += `<range${
                    elem.fromDate ? ' from_date="' + elem.fromDate + '"' : ""
                  }${elem.toDate ? ' to_date="' + elem.toDate + '"' : ""}>`;
                  specificinfo += `<from>${elem.range.from}</from>`;
                  specificinfo += `<to>${elem.range.to}</to>`;
                  specificinfo += `</range>`;
                }
                if (elem.value) {
                  specificinfo += `<value${
                    elem.fromDate ? ' from_date="' + elem.fromDate + '"' : ""
                  }${elem.toDate ? ' to_date="' + elem.toDate + '"' : ""}>`;
                  specificinfo += `${elem.value}`;
                  specificinfo += `</value>`;
                }
                specificinfo += `</ani>`;
              });
              specificinfo += `</ani_list>`;
            }
            specificinfo += `</add>`;
          }
          if (
            params.specific.voip.operations.update &&
            Object.keys(params.specific.voip.operations.update).length
          ) {
            specificinfo += `<update>`;
            if (
              params.specific.voip.operations.update.aniList &&
              params.specific.voip.operations.update.aniList.length
            ) {
              specificinfo += `<ani_list>`;
              params.specific.voip.operations.update.aniList.forEach(elem => {
                specificinfo += `<ani group="${elem.group}">`;
                if (elem.range) {
                  specificinfo += `<range${
                    elem.fromDate ? ' from_date="' + elem.fromDate + '"' : ""
                  }${elem.toDate ? ' to_date="' + elem.toDate + '"' : ""}>`;
                  specificinfo += `<from>${elem.range.from}</from>`;
                  specificinfo += `<to>${elem.range.to}</to>`;
                  specificinfo += `</range>`;
                }
                if (elem.value) {
                  specificinfo += `<value${
                    elem.fromDate ? ' from_date="' + elem.fromDate + '"' : ""
                  }${elem.toDate ? ' to_date="' + elem.toDate + '"' : ""}>`;
                  specificinfo += `${elem.value}`;
                  specificinfo += `</value>`;
                }
                specificinfo += `</ani>`;
              });
              specificinfo += `</ani_list>`;
            }
            specificinfo += `</update>`;
          }
          if (
            params.specific.voip.operations.delete &&
            Object.keys(params.specific.voip.operations.delete).length
          ) {
            specificinfo += `<delete>`;
            if (
              params.specific.voip.operations.delete.aniList &&
              params.specific.voip.operations.delete.aniList.length
            ) {
              specificinfo += `<ani_list>`;
              params.specific.voip.operations.delete.aniList.forEach(elem => {
                specificinfo += `<ani group="${elem.group}"/>`;
              });
              specificinfo += `</ani_list>`;
            }
            specificinfo += `</delete>`;
          }
          specificinfo += `</operations>`;
        }
        specificinfo += `</voip>`;
      }
      specificinfo += `</specific>`;
    }

    let operationsinfo = ``;
    if (params.operations) {
      operationsinfo += `<operations>`;
      if (params.operations.update) {
        operationsinfo += `<update>`;
        if (params.operations.update.tariffCode) {
          operationsinfo += `<tariff_line line="1" tariff="${params.operations.update.tariffCode}">
            <recurring_charge_settings>
              <fixed_price>${params.operations.update.recurringCharge}</fixed_price>
            </recurring_charge_settings>
          </tariff_line>`;
        }
        operationsinfo += `</update>`;
      }
      if (params.operations.deactivate) {
        operationsinfo += `<deactivate close_referent_services="true" close_used="true"/>`;
      }
      operationsinfo += `</operations>`;
    }
    return `${accountinfo}
    <service id="${params.serviceId}">
    ${specificinfo}
    ${operationsinfo} 
    </service>`;
  },

  /**
   * Generate SOAP body to get a list of goods for an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account code for the MindBill account to get the list of goods for.
   * }
   */
  getAccountGoodsInstancesList(params) {
    logger.info("MindBill SOAP getAccountGoodsInstancesList");
    return `<account id="${params.accountId}"/>`;
  },

 /**
   * Generate SOAP body for a specific goods instance.
   *
   * @param {object} params
   * {
   *    @param {string} goodId(required)  The good id of the instacne to get.
   * }
   */
  getAccountGoodsInstance(params) {
    logger.info("MindBill SOAP getAccountGoodsInstance");
    return `<good_instance id="${params.goodId}"/>`;
  },  

  /**
   * Generate SOAP body for get ANI list from telephone number.
   *
   * @param {object} params
   * {
   *    @param {string} phoneNumber(required)  The telehone number to get.
   *    @param {string} serviceType(required)  The service type associated with the telephone number.
   * }
   */
  getAniList(params) {
    logger.info("MindBill SOAP getAniList");
    return `<phone_number><value>${params.phoneNumber}</value></phone_number>
      <service_type>${params.serviceType}</service_type>`;
  },

  /**
   * Generate SOAP body for get a list of services for an account.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account code for the MindBill account to get the list of services for.
   * }
   */
  getAccountServiceList(params) {
    logger.info("MindBill SOAP getAccountServiceList");
    return `<account id="${params.accountId}"/>`;
  },

  /**
   * Generate SOAP body for replacing a service account's good.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill service account to replace goods for.
   *    @param {string} accountCode(required)  The code for the MindBill service account to replace goods for.
   *    @param {string} oldModel(required) The old goods model.
   *    @param {string} oldType(required) The old goods type.
   *    @param {string} newModel(required) The new goods model.
   *    @param {string} newType(required) The new goods type.
   *    @param {string} oldItem(optional) The old goods item value.
   *    @param {string} newItem(required) The new goods item value.
   *    @param {array} advanced(optional) An array of udf key/value pairs related to this goods instance.
   *    @param {object} price(optional) The goods price object.
   *    {
   *      @param {object} amount(optional) The goods price amount object
   *      {
   *        @param {number} value(required) The price amount value of the good.
   *        @param {string} currencyCode(optional) The price amount currency code.
   *      }
   *      @param {object} discount(optional) The goods price discount object.
   *      {
   *        @param {number} value(required) The price discount value of the good.
   *        @param {number} percentage(optional) The price discount percentage value of the good.
   *        @param {string} currencyCode(optional) The price discount currency code.
   *      }
   *    }
   * }
   */
  replaceAccountGoodsInstance(params) {
    logger.info("MindBill SOAP replaceAccountGoodsInstance");
    let olditeminfo = ``;
    if (params.oldItem) {
      olditeminfo += `<item>${params.oldItem}</item>`;
    }
    let priceinfo = ``;
    if (params.price) {
      priceinfo += `<price>`;
      if (typeof params.price.amount !== "undefined") {
        priceinfo += `<amount curr_alpha_code="${params.price.amount.currencyCode || "CAD"}">${
          params.price.amount.value
        }</amount>`;
      }
      if (params.price.discount) {
        priceinfo += `<discount>`;
        if (typeof params.price.discount.percentage !== "undefined") {
          priceinfo += `<percentage_value>${params.price.discount.percentage}</percentage_value>`;
        }
        if (typeof params.price.discount.value !== "undefined") {
          priceinfo += `<value curr_alpha_code="${params.price.discount.currencyCode || "CAD"}">${
            params.price.discount.value
          }</value>`;
        }
        priceinfo += `</discount>`;
      }
      priceinfo += `</price>`;
    }
    let advancedinfo = ``;
    if (params.advanced && params.advanced.length) {
      params.advanced.forEach(udf => {
        advancedinfo += `<advanced><udf><field code="${udf.code}" value="${
          udf.value
        }"/></udf></advanced>`;
      });
    }
    return `<good_instance_details>
    <account id="${params.accountId}"/>
    <type>${params.oldType}</type>
    <model>${params.oldModel}</model>
    ${olditeminfo}
    </good_instance_details>
    <replace_with>
    <type>${params.newType}</type>
    <model>${params.newModel}</model>
    <item>${params.newItem}</item>
    ${priceinfo}
    ${advancedinfo}    
    </replace_with>`;
  },

  /**
   * Generate SOAP body for returning a service account's good.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill service account to replace goods for.
   *    @param {string} accountCode(required)  The code for the MindBill service account to replace goods for.
   *    @param {string} oldModel(required) The old goods model.
   *    @param {string} oldType(required) The old goods type.
   *    @param {string} oldItem(required) The old goods item value.
   * }
   */
  returnAccountGoodsInstance(params) {
    logger.info("MindBill SOAP returnAccountGoodsInstance");
    return `<good_instance_details>
    <account id="${params.accountId}"/>
    <type>${params.oldType}</type>
    <model>${params.oldModel}</model>
    <item>${params.oldItem}</item>
    </good_instance_details>`;
  },

  /**
   * Generate SOAP body for adding a service account's good.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill service account to add goods for.
   *    @param {string} accountCode(required)  The code for the MindBill service account to add goods for.
   *    @param {string} newModel(required) The goods model.
   *    @param {string} newType(required) The good type.
   *    @param {string} newItem(required) The new goods item value.
   *    @param {array} advanced(optional) An array of udf key/value pairs related to this goods instance.
   *    @param {object} price(optional) The goods price object.
   *    {
   *      @param {object} amount(optional) The goods price amount object
   *      {
   *        @param {number} value(required) The price amount value of the good.
   *        @param {string} currencyCode(optional) The price amount currency code.
   *      }
   *      @param {object} discount(optional) The goods price discount object.
   *      {
   *        @param {number} value(required) The price discount value of the good.
   *        @param {number} percentage(optional) The price discount percentage value of the good.
   *        @param {string} currencyCode(optional) The price discount currency code.
   *      }
   *    }
   * }
   */
  addAccountGoodsInstance(params) {
    logger.info("MindBill SOAP addAccountGoodsInstance");
    let priceinfo = ``;
    if (params.price) {
      priceinfo += `<price no_tax="${params.price.tax || true}">`;
      if (typeof params.price.amount !== "undefined") {
        priceinfo += `<amount curr_alpha_code="${params.price.amount.currencyCode || "CAD"}">${
          params.price.amount.value
        }</amount>`;
      }
      if (typeof params.price.discount !== "undefined") {
        priceinfo += `<discount>`;
        if (typeof params.price.discount.percentage !== "undefined") {
          priceinfo += `<percentage_value>${params.price.discount.percentage}</percentage_value>`;
        }
        if (typeof params.price.discount.value !== "undefined") {
          priceinfo += `<value curr_alpha_code="${params.price.discount.currencyCode || "CAD"}">${
            params.price.discount.value
          }</value>`;
        }
        priceinfo += `</discount>`;
      }
      priceinfo += `</price>`;
    }
    let advancedinfo = ``;
    if (params.advanced && params.advanced.length) {
      params.advanced.forEach(udf => {
        advancedinfo += `<advanced><udf><field code="${udf.code}" value="${
          udf.value
        }"/></udf></advanced>`;
      });
    }
    return `<account id="${params.accountId}">
    <good_instance>
    <type>${params.newType}</type>
    <model>${params.newModel}</model>
    <item>${params.newItem}</item>
    ${priceinfo}
    ${advancedinfo}
    </good_instance>
    </account>`;
  },

  /**
   * Generate SOAP body for canceling a service account's good.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill service account to cancel goods for.
   *    @param {string} accountCode(required)  The code for the MindBill service account to cancel goods for.
   *    @param {string} oldModel(required) The goods model.
   *    @param {string} oldType(required) The good type.
   *    @param {string} oldItem(optional) The good item.
   * }
   */
  cancelAccountGoodsInstance(params) {
    logger.info("MindBill SOAP cancelAccountGoodsInstance");
    // let iteminfo = ``;
    let iteminfo = `<item_not_assigned/>`;
    if (params.oldItem) {
      iteminfo = `<item>${params.oldItem}</item>`;
    }
    return `<good_instance_details allow_cancel_in_terminate_status="true">
      <account id="${params.accountId}"/>
      <type>${params.oldType}</type>
      <model>${params.oldModel}</model>
      ${iteminfo}
      </good_instance_details>`;
  },

  /**
   * Generate SOAP body for adding a deposit.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The code for the MindBill account to add a deposit for.
   *    @param {string} type(required) The type of deposit.
   *    @param {string} currency(required) The currency of the deposit to be applied to the account.
   *        For a list of ISO4217 currency codes please reference http://www.xe.com/iso4217.php
   *    @param {number} amount(required) The amount if the deposit.
   *    @param {string} note(optional) A note regarding the deposit.
   * }
   */
  addDeposit(params) {
    logger.info("MindBill SOAP addDeposit");
    let noteinfo = ``;
    if (params.note) {
      noteinfo += `<note>${params.note}</note>`;
    }
    return `<account id="${params.accountId}">
        <deposit>
          <deposit_type_code>${params.type}</deposit_type_code>
          <amount curr_alpha_code="${params.currency}">${params.amount}</amount>
          ${noteinfo}
        </deposit>
      </account>`;
  },

  /**
   * Generate SOAP body for deleting a deposit.
   *
   * @param {object} params
   * {
   *    @param {string} depositId(required) The deposit to delete.
   * }
   */
  deleteDeposit(params) {
    logger.info("MindBill SOAP deleteDeposit");
    return `<deposit number="${params.depositId}"/>`;
  },

  /**
   * Generate SOAP body for updating a deposit.
   *
   * @param {object} params
   * {
   *    @param {string} depositId(required) The deposit to delete.
   *    @param {string} note(required) A note regarding the deposit.
   * }
   */
  updateDeposit(params) {
    logger.info("MindBill SOAP updateDeposit");
    return `<deposit number="${params.depositId}">
      <note>${params.note}</note>
    </deposit>`;
  },

  /**
   * Generate SOAP body for getting a deposit.
   *
   * @param {object} params
   * {
   *    @param {string} depositId(required) The deposit to get.
   * }
   */
  getDeposit(params) {
    logger.info("MindBill SOAP getDeposit");
    return `<deposit number="${params.depositId}"/>`;
  },

  /**
   * Generate SOAP body for getting a deposit list based on filters.
   *
   * @param {object} params
   * {
   *    @param {Array} accountId(required) The account to get desposits for.
   *    @param {Array} status(required) The status of deposits to retrieve.
   *    @param {object} filters(required) The filter object to use. {
   * 				@param {string} paymentId(optional)
   * 				@param {string} refundId(optional)
   *				@param {string} fromDate(optional)
   *				@param {string} toDate(optional)
   *				@param {string} type(optional)
   *        @param {string} productCode(optional)
   *    }
   * }
   */
  getDepositList(params) {
    logger.info("MindBill SOAP getDepositList");
    let accountinfo = ``;
    if (params.accountId && params.accountId.length) {
      params.accountId.forEach(account => {
        accountinfo += `<account id="${account}"/>`;
      });
    }
    let statusinfo = ``;
    if (params.status && params.status.length) {
      params.statusinfo.forEach(status => {
        statusinfo += `<deposit_status>${params.status}</deposit_status>`;
      });
    }
    let filterinfo = ``;
    if (params.filters && Object.keys(params.filters).length) {
      filterinfo = `<filter`;
      if (params.filters.paymentId) {
        filterinfo += ` payment_number="${params.filters.paymentId}"`;
      }
      if (params.filters.refundId) {
        filterinfo += ` refund_number="${params.filters.refundId}"`;
      }
      if (params.filters.fromDate) {
        filterinfo += ` from_date="${params.filters.fromDate}"`;
      }
      if (params.filters.toDate) {
        filterinfo += ` to_date="${params.filters.toDate}"`;
      }
      if (params.filters.type) {
        filterinfo += ` deposit_type_code="${params.filters.type}"`;
      }
      if (params.filters.productCode) {
        filterinfo += ` product_code="${params.filters.productCode}"`;
      }
      filterinfo += `/>`;
    }
    return `${accountinfo}
      ${statusinfo}
      ${filterinfo}
    `;
  },

  /**
   * Generate SOAP body for getting service usage based on filters.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The account id of the service to retrieve the usage for.
   *    @param {string} serviceId(required)  The service id to retrieve the usage for.
   *    @param {object} filters(required) The filter object to use. {
   *				@param {string} invoiceNumber(optional) The invoice number to get the usage for.
   *				@param {boolean} newUsage(optional) Get only current/unbilled usage.
   *				@param {string} fromDate(optional but required with toDate) The starting date to get the usage for in format YYYY-MM-DD.
   *				@param {string} toDate(optional but required with fromDate) The ending date to get the usage for in format YYYY-MM-DD.
   *    }
   * }
   */
  getAccountServiceUsage(params) {
    logger.info("MindBill SOAP getAccountServiceUsage");
    let filterinfo = ``;
    filterinfo = `<filter>`;
    if (params.filters.invoiceId) {
      filterinfo += `<invoice invoice_no="${params.filters.invoiceNumber}"/>`;
    }
    if (params.filters.newUsage) {
      filterinfo += `<new_usage>true</new_usage>`;
    }
    if (params.filters.fromDate && params.filters.toDate) {
      filterinfo += `<date_range`;
      filterinfo += ` from_date="${params.filters.fromDate}"`;
      filterinfo += ` to_date="${params.filters.toDate}"`;
      filterinfo += `/>`;
    }
    filterinfo += `<include_inv_non_visible>true</include_inv_non_visible>`;
    filterinfo += `<include_non_billable_calls>false</include_non_billable_calls>`;
    filterinfo += `</filter>`;
    return `<account id="${params.accountId}"/>
    <service id="${params.serviceId}"/>
      ${filterinfo}
    `;
  },

  /**
   * Generate SOAP body for add account service operation.
   *
   * @param {object} params
   * {
   *    @param {string} accountId(required)  The id for the MindBill account to add the service for.
   *    @param {string} accountCode(required)  The code for the MindBill account to add the service for.
   *    @param {object} service(required) The service object to use.
   *    {
   *				@param {string} code(required) The service code to add.
   *        @param {object} config(optional) A config object with any necessary properties for the service
   *    }
   * }
   */
  addAccountService(params) {
    logger.info("MindBill SOAP addAccountService");
    let relativeinfo = ``;
    if (params.service.config && params.service.config.installments) {
      relativeinfo += `<relative><aging>${params.service.config.installments}</aging></relative>`;
    }
    let totalchargeinfo = ``;
    if (params.service.config && params.service.config.amount) {
      totalchargeinfo += `<total_charge>${params.service.config.amount}</total_charge>`;
    }
    return `<account id="${params.accountId}">
    <service code="${params.service.code}">
    ${relativeinfo}
    ${totalchargeinfo}
    </service>
    </account>`;
  }
};
