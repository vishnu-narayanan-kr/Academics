"use strict";

const ERROR_CODES = require("./../../error-codes");

module.exports = {
  errorFormatter: (param, msg, value, location) => {
    const message = ERROR_CODES[msg];
    return {
      param,
      message,
      code: parseInt(msg),
      value,
      location
    };
  },
  customValidators: {
    isValidShortDate: (value = "") => {
      const regEx = /^\d{4}-\d{2}$/;
      if (typeof value !== "string") {
        return false;
      }
      if (!value.match(regEx)) {
        return false; // Invalid format
      }
      const d = new Date(value);
      if (!d.getTime()) {
        return false; // Invalid date (or this could be epoch)
      }
      return d.toISOString().slice(0, 7) === value;
    },

    isValidDate: (value = "") => {
      const regEx = /^\d{4}-\d{2}-\d{2}$/;
      if (typeof value !== "string") {
        return false;
      }
      if (!value.match(regEx)) {
        return false; // Invalid format
      }
      const d = new Date(value);
      if (!d.getTime()) {
        return false; // Invalid date (or this could be epoch)
      }
      return d.toISOString().slice(0, 10) === value;
    },
    isValidStatus: (value = "") => {
      return ["ACTIVE", "SUSPENDED", "CLOSED"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidCurrency: (value = "") => {
      return ["CAD", "USD"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidCreditCardType: (value = "") => {
      return ["VISA", "MASTERCARD", "AMEX"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidCreditCardNumber: (value = "") => {
      return /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13})$/.test(
        value
      );
    },
    isValidCreditCardCVV: (value = "") => {
      return /^[0-9]{3,4}$/.test(value);
    },
    isValidCreditCardExpiryMonth: (value = "") => {
      return /^[0-9]{2}$/.test(value) && parseInt(value) < 13 && parseInt(value) > 0;
    },
    isValidCreditCardExpiryYear: (value = "") => {
      return /^[0-9]{4}$/.test(value) && parseInt(value) >= new Date().getFullYear();
    },
    isValidLanguageCode: (value = "") => {
      return ["EN", "FR"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidPaymentSource: (value = "") => {
      return ["CREDITCARD", "BANKACCOUNT"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidPaymentMethod: (value = "") => {
      return ["CASH", "CHEQUE", "CREDITCARD", "DEBITCARD", "WIRE", "ACH", "PAYPAL", "VOUCHER"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidServiceType: (value = "") => {
      return ["ADSL", "GPRS", "FAX", "MOBILEINC", "MOBILEOUT", "RGPRS", "RMOBILEINC", "RMOBILEOUT", "RSMSINC", "RSMSOUT", "SMSINC", "SMSOUT", "VOIP"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidAccountStatus: (value = "") => {
      return ["NEW", "ACTIVE", "SUSPENDED", "CLOSED"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidAreaCode: (value = "") => {
      return /^[1-9]\d{2}$/.test(value);
    },
    isValidExchangeCode: (value = "") => {
      return /^[1-9]\d{2}$/.test(value);
    },
    isValidLineNumber: (value = "") => {
      return /^[0-9]\d{3}$/.test(value);
    },
    isValidFullNumber: (value = "") => {
      return /^[1]([2-9]\d{2})([2-9]\d{2})(\d{4})$/.test(value);
    },
    isEmptyString: (value = null) => {
      return typeof value === "string" && value.length !== 0;
    },
    isArray: (value = null) => {
      return Array.isArray(value);
    },
    isNotArray: (value = null) => {
      return !Array.isArray(value);
    },
    arrayNotEmpty: (value = null) => {
      return Array.isArray(value) && value.length > 0;
    },
    isYesOrNo: (value = "") => {
      return ["YES", "NO"].indexOf(value && value.toUpperCase()) > -1;
    },
    gt: (param, num) => {
      return param > num;
    },
    gte: (param, num) => {
      return param >= num;
    },
    lt: (param, num) => {
      return param < num;
    },
    lte: (param, num) => {
      return param <= num;
    },
    isNumber: (value = null) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },
    isPositive: (value = null) => {
      return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) > 0;
    },
    isInteger: (value = null) => {
      return Number.isInteger(value);
    },
    isValidUrl: (value = "") => {
      // return /^(HTTP:\/\/|HTTPS:\/\/|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
      // return /^(([hH][tT][tT][pP])[sS]?:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
      return /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?:([a-z0-9][a-z0-9\-]*)?[a-z0-9]+)(?:\.(?:[a-z0-9\-])*[a-z0-9]+)*(?:\.(?:[a-z]{2,})(:\d{1,5})?))(?:\/[^\s]*)?/gmi.test(value);
    },
    isValidSecureUrl: (value = "") => {
      // return /^(HTTP:\/\/|HTTPS:\/\/|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
      // return /^(([hH][tT][tT][pP])[sS]?:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(value);
      return /^(?:(?:https):\/\/)(?:\S+(?::\S*)?@)?(?:(?:([a-z0-9][a-z0-9\-]*)?[a-z0-9]+)(?:\.(?:[a-z0-9\-])*[a-z0-9]+)*(?:\.(?:[a-z]{2,})(:\d{1,5})?))(?:\/[^\s]*)?/gmi.test(value);
    },
    isActualBoolean: (value = null) => {
      return (
        typeof value === "boolean"
      );
    },
    isBooleanString: (value = "") => {
      return (
        (typeof value === "string" && (value.toLowerCase() === "true" || value.toLowerCase() === "false"))
      );
    },
    isValidPostalCode: (value = "") => {
      return /^[abceghjklmnprstvxyABCEGHJKLMNPRSTVXY][0-9][abceghjklmnprstvwxyzABCEGHJKLMNPRSTVWXYZ][\s]{0,1}[0-9][abceghjklmnprstvwxyzABCEGHJKLMNPRSTVWXYZ][0-9]$/.test(
        value
      );
    },
    isAlphaNumericWithSpace: (value = "") => {
      return /^[a-zA-Z0-9\s]+$/.test(value);
    },
    isValidInvoiceStatus: (value = "") => {
      return /^[02]{1}$/.test(value);
    },
    isValidDecimal2Places: (value = null) => {
      return /^\s*-?\d*(\.\d{1,2})?\s*$/.test(value);
    },
    isValidUnitNumber: (value = "") => {
      return value === "" || /^[a-zA-Z0-9]+$/.test(value);
    },
    isValidStreetName: (value = "") => {
      return /^[0-9a-zA-Z ]+$/.test(value);
    },
    isValidStreetSuffix: (value = "") => {
      return /^[0-9a-zA-Z ]+$/.test(value);
    },
    isValidTelephoneNumberDev: (value = "") => {
      return /1([1-9]\d{2})([1-9]\d{2})(\d{4})/.test(value);
    },
    isValidTelephoneNumber: (value = "") => {
      return /1([2-9]\d{2})([2-9]\d{2})(\d{4})/.test(value);
    },
    isValidTelephoneNumberArray: function (value) {
      if (this.isArray(value) && value.length > 0) {
        for (let i = 0, j = value.length; i < j; i++) {
          let obj = value[i];
          if (!this.isEmptyString(obj) || !/^\d+$/.test(obj) || !this.isValidTelephoneNumber(obj)) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    },
    isValidDepositType: (value = "") => {
      return ["SECDEPOSIT"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidBalanceType: (value = "") => {
      return ["ACCOUNT", "TAB", "MONEYWALLET"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidAdjustmentType: (value = "") => {
      return ["BALANCEMIGR", "CRED", "DEP", "EC", "MISC"].indexOf(value && value.toUpperCase()) > -1;
    },
    isValidPortingServiceType: (value = "") => {
      return ["WIRELINE", "WIRELESS"].indexOf(value && value.toUpperCase()) > -1;
    },
    isObject: (value = "") => {
      return value === Object(value) && Object.prototype.toString.call(value) !== "[object Array]";
    },
    isNotObject: (value = null) => {
      return value !== Object(value) || value === null;
    },
    isValidBillyngType: (value = "") => {
      return ["POSTPAID", "PREPAID"].indexOf(value && value.toUpperCase()) > -1;
    },
    isNotEmptyString: (value = null) => {
      return typeof value === "string" && value.length > 0;
    },
  }
};