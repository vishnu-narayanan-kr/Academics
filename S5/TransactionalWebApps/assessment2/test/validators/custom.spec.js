"use strict";
const chai = require("chai");
const custom_validators = require("./../../utils/validators/express-validator-options").customValidators;
const assert = chai.assert;
describe('Custom Validators Tests', () => {
    describe('isValidDate', () => {
        it('should be a valid date', () => {
            let isValid = custom_validators.isValidDate("1999-01-29");
            assert.isTrue(isValid, 'the date "1999-01-29" is valid');
        });
        it('should be an invalid date', () => {
            let isValid = custom_validators.isValidDate("1999-01-32");
            assert.isFalse(isValid, 'the date "1999-01-32 is" invalid');
            isValid = custom_validators.isValidDate("19990132");
            assert.isFalse(isValid, 'the date "19990132" is invalid');
            isValid = custom_validators.isValidDate(19990132);
            assert.isFalse(isValid, 'the date 19990132 is invalid');
            isValid = custom_validators.isValidDate();
            assert.isFalse(isValid, 'the date "" is invalid');
        });
    });
    describe('isValidStatus', () => {
        it('should be a valid status', () => {
            let isValid = custom_validators.isValidStatus("ACTIVE");
            assert.isTrue(isValid, 'the status "ACTIVE" is valid');
            isValid = custom_validators.isValidStatus("closed");
            assert.isTrue(isValid, 'the status "closed" is valid');
        });
        it('should be an invalid status', () => {
            let isValid = custom_validators.isValidStatus("OKIEDOKIE");
            assert.isFalse(isValid, 'the status "OKIEDOKIE" is invalid');
            isValid = custom_validators.isValidStatus();
            assert.isFalse(isValid, 'the status "" is invalid');
        });
    });
    describe('isValidCurrency', () => {
        it('should be a valid currency', () => {
            let isValid = custom_validators.isValidCurrency("CAD");
            assert.isTrue(isValid, 'the currency "CAD" is valid');
            isValid = custom_validators.isValidCurrency("usd");
            assert.isTrue(isValid, 'the currency "USD" is valid');
        });
        it('should be an invalid currency', () => {
            let isValid = custom_validators.isValidCurrency("FUD");
            assert.isFalse(isValid, 'the currency "FUD" is invalid');
            isValid = custom_validators.isValidCurrency();
            assert.isFalse(isValid, 'the currency "" is invalid');
        });
    });
    describe('isValidCreditCardType', () => {
        it('should be a valid credit card type', () => {
            let isValid = custom_validators.isValidCreditCardType("VISA");
            assert.isTrue(isValid, 'the credit card type "VISA" is valid');
            isValid = custom_validators.isValidCreditCardType("amex");
            assert.isTrue(isValid, 'the credit card type "amex" is valid');
        });
        it('should be an invalid credit card type', () => {
            let isValid = custom_validators.isValidCreditCardType("FUD");
            assert.isFalse(isValid, 'the credit card type "FUD" is invalid');
            isValid = custom_validators.isValidCreditCardType();
            assert.isFalse(isValid, 'the credit card type "" is invalid');
        });
    });

    describe('isValidCreditCardNumber', () => {
        it('should be a valid credit card number', () => {
            let isValid = custom_validators.isValidCreditCardNumber("5555555555554444");
            assert.isTrue(isValid, 'the credit card number "5555555555554444" is valid');
            isValid = custom_validators.isValidCreditCardNumber("378282246310005");
            assert.isTrue(isValid, 'the credit card number "378282246310005" is valid');
            isValid = custom_validators.isValidCreditCardNumber("4111111111111111");
            assert.isTrue(isValid, 'the credit card number "4111111111111111" is valid');
        });
        it('should be an invalid credit card number', () => {
            let isValid = custom_validators.isValidCreditCardNumber("513323662460830");
            assert.isFalse(isValid, 'the credit card number "513323662460830" is invalid');
            isValid = custom_validators.isValidCreditCardNumber("41211111112");
            assert.isFalse(isValid, 'the credit card number "41211111112" is invalid');
            isValid = custom_validators.isValidCreditCardNumber();
            assert.isFalse(isValid, 'the credit card number "" is invalid');
        });
    });
    describe('isValidCreditCardCVV', () => {
        it('should be a valid credit card CVV', () => {
            let isValid = custom_validators.isValidCreditCardCVV("123");
            assert.isTrue(isValid, 'the credit card CVV 123 is valid');
            isValid = custom_validators.isValidCreditCardCVV("3211");
            assert.isTrue(isValid, 'the credit card CVV 3211 is valid');
        });
        it('should be an invalid credit card CVV', () => {
            let isValid = custom_validators.isValidCreditCardCVV("10");
            assert.isFalse(isValid, 'the credit card CVV 10 is invalid');
            isValid = custom_validators.isValidCreditCardCVV("14032");
            assert.isFalse(isValid, 'the credit card CVV 14032 is invalid');
            isValid = custom_validators.isValidCreditCardCVV("abc");
            assert.isFalse(isValid, 'the credit card CVV "abc" is invalid');
            isValid = custom_validators.isValidCreditCardCVV();
            assert.isFalse(isValid, 'the credit card CVV "" is invalid');
        });
    });
    describe('isValidCreditCardExpiryMonth', () => {
        it('should be a valid credit card expiry month', () => {
            let isValid = custom_validators.isValidCreditCardExpiryMonth("01");
            assert.isTrue(isValid, 'the credit card expiry month 01 is valid');
        });
        it('should be an invalid credit card expiry month', () => {
            let isValid = custom_validators.isValidCreditCardExpiryMonth("123");
            assert.isFalse(isValid, 'the credit card expiry month 123 is invalid');
            isValid = custom_validators.isValidCreditCardExpiryMonth("14");
            assert.isFalse(isValid, 'the credit card expiry month 14 is invalid');
            isValid = custom_validators.isValidCreditCardExpiryMonth("ab");
            assert.isFalse(isValid, 'the credit card expiry month "ab" is invalid');
            isValid = custom_validators.isValidCreditCardExpiryMonth();
            assert.isFalse(isValid, 'the credit card expiry month "" is invalid');
        });
    });
    describe('isValidCreditCardExpiryYear', () => {
        it('should be a valid credit card expiry year', () => {
            let isValid = custom_validators.isValidCreditCardExpiryYear(new Date().getFullYear());
            assert.isTrue(isValid, 'the credit card expiry year ' + new Date().getFullYear() + ' is valid');
        });
        it('should be an invalid credit card expiry year', () => {
            let isValid = custom_validators.isValidCreditCardExpiryYear("123");
            assert.isFalse(isValid, 'the credit card expiry year 123 is invalid');
            isValid = custom_validators.isValidCreditCardExpiryYear("2010");
            assert.isFalse(isValid, 'the credit card expiry year 14 is invalid');
            isValid = custom_validators.isValidCreditCardExpiryYear("ab");
            assert.isFalse(isValid, 'the credit card expiry year "ab" is invalid');
            isValid = custom_validators.isValidCreditCardExpiryYear();
            assert.isFalse(isValid, 'the credit card expiry year "" is invalid');
        });
    });
    describe('isValidLanguageCode', () => {
        it('should be a valid language code', () => {
            let isValid = custom_validators.isValidLanguageCode("EN");
            assert.isTrue(isValid, 'the language code "EN" is valid');
            isValid = custom_validators.isValidLanguageCode("fr");
            assert.isTrue(isValid, 'the language code "fr" is valid');
        });
        it('should be an invalid language code', () => {
            let isValid = custom_validators.isValidLanguageCode("BQA");
            assert.isFalse(isValid, 'the language code "BQA" is invalid');
            isValid = custom_validators.isValidLanguageCode();
            assert.isFalse(isValid, 'the language code "" is invalid');
        });
    });
    describe('isValidPaymentSource', () => {
        it('should be a valid payment source', () => {
            let isValid = custom_validators.isValidPaymentSource("CREDITCARD");
            assert.isTrue(isValid, 'the payment source "CREDITCARD" is valid');
            isValid = custom_validators.isValidPaymentSource("bankAccount");
            assert.isTrue(isValid, 'the payment source "bankAccount" is valid');
        });
        it('should be an invalid payment source', () => {
            let isValid = custom_validators.isValidPaymentSource("MYMONEY");
            assert.isFalse(isValid, 'the payment source "MYMONEY" is invalid');
            isValid = custom_validators.isValidPaymentSource();
            assert.isFalse(isValid, 'the payment source "" is invalid');
        });
    });
    describe('isValidPaymentMethod', () => {
        it('should be a valid payment method', () => {
            let isValid = custom_validators.isValidPaymentMethod("CREDITCARD");
            assert.isTrue(isValid, 'the payment method "CREDITCARD" is valid');
            isValid = custom_validators.isValidPaymentMethod("CASH");
            assert.isTrue(isValid, 'the payment method "CASH" is valid');
            isValid = custom_validators.isValidPaymentMethod("CHEQUE");
            assert.isTrue(isValid, 'the payment method "CHEQUE" is valid');
            isValid = custom_validators.isValidPaymentMethod("DEBITCARD");
            assert.isTrue(isValid, 'the payment method "DEBITCARD" is valid');
            isValid = custom_validators.isValidPaymentMethod("WIRE");
            assert.isTrue(isValid, 'the payment method "WIRE" is valid');
            isValid = custom_validators.isValidPaymentMethod("ACH");
            assert.isTrue(isValid, 'the payment method "ACH" is valid');
            isValid = custom_validators.isValidPaymentMethod("paypal");
            assert.isTrue(isValid, 'the payment method "paypal" is valid');
            isValid = custom_validators.isValidPaymentMethod("VOUCHER");
            assert.isTrue(isValid, 'the payment method "VOUCHER" is valid');
        });
        it('should be an invalid payment method', () => {
            let isValid = custom_validators.isValidPaymentMethod("MYMONEY");
            assert.isFalse(isValid, 'the payment method "MYMONEY" is invalid');
            isValid = custom_validators.isValidPaymentMethod();
            assert.isFalse(isValid, 'the payment method "" is invalid');
        });
    });
    describe('isValidAreaCode', () => {
        it('should be a valid area code', () => {
            let isValid = custom_validators.isValidAreaCode("213");
            assert.isTrue(isValid, 'the area code "213" is valid');
        });
        it('should be an invalid area code', () => {
            let isValid = custom_validators.isValidAreaCode("21");
            assert.isFalse(isValid, 'the area code "21" is invalid');
            isValid = custom_validators.isValidAreaCode("012");
            assert.isFalse(isValid, 'the area code "012" is invalid');
            isValid = custom_validators.isValidAreaCode();
            assert.isFalse(isValid, 'the area code "" is invalid');
        });
    });
    describe('isValidExchangeCode', () => {
        it('should be a valid exchange code', () => {
            let isValid = custom_validators.isValidExchangeCode("213");
            assert.isTrue(isValid, 'the exchange code "213" is valid');
        });
        it('should be an invalid exchange code', () => {
            let isValid = custom_validators.isValidExchangeCode("21");
            assert.isFalse(isValid, 'the exchange code "21" is invalid');
            isValid = custom_validators.isValidExchangeCode("012");
            assert.isFalse(isValid, 'the exchange code "012" is invalid');
            isValid = custom_validators.isValidExchangeCode();
            assert.isFalse(isValid, 'the exchange code "" is invalid');
        });
    });
    describe('isValidLineNumber', () => {
        it('should be a valid line number', () => {
            let isValid = custom_validators.isValidLineNumber("0213");
            assert.isTrue(isValid, 'the line number 0213 is valid');
        });
        it('should be an invalid area exchange', () => {
            let isValid = custom_validators.isValidLineNumber("21");
            assert.isFalse(isValid, 'the line number 21 is invalid');
            isValid = custom_validators.isValidLineNumber("012");
            assert.isFalse(isValid, 'the line number 012 is invalid');
            isValid = custom_validators.isValidLineNumber("abcd");
            assert.isFalse(isValid, 'the line number "abcd" is invalid');
            isValid = custom_validators.isValidLineNumber();
            assert.isFalse(isValid, 'the line number "" is invalid');
        });
    });
    describe('isEmptyString', () => {
        it('should be valid and empty', () => {
            let isEmpty = custom_validators.isEmptyString("");
            assert.isTrue(!isEmpty, '"" is empty');
        });
        it('should not be empty or is invalid', () => {
            let isEmpty = custom_validators.isEmptyString("a21");
            assert.isFalse(!isEmpty, '"a21" is not empty or invalid');
            isEmpty = custom_validators.isEmptyString();
            assert.isFalse(isEmpty, 'null is not empty or invalid');
        });
    });
    describe('isArray', () => {
        it('should be an array', () => {
            let isArray = custom_validators.isArray([]);
            assert.isTrue(isArray, '[] is an array');
        });
        it('should not be an array', () => {
            let isArray = custom_validators.isArray("21");
            assert.isFalse(isArray, '"21" is not an array');
            isArray = custom_validators.isArray({});
            assert.isFalse(isArray, '"{}" is not an array');
            isArray = custom_validators.isArray();
            assert.isFalse(isArray, 'null is not an array');
        });
    });
    describe('isNotArray', () => {
        it('should not be an array', () => {
            let isArray = custom_validators.isNotArray();
            assert.isTrue(isArray, ' is not an array');
            isArray = custom_validators.isNotArray("");
            assert.isTrue(isArray, '"" is not an array');
            isArray = custom_validators.isNotArray({key: "value"});
            assert.isTrue(isArray, '"{key: \"value\"}" is not an array');
        });
        it('should be an array', () => {
            let isArray = custom_validators.isNotArray([]);
            assert.isFalse(isArray, '"[]" is an array');
        });
    });    
    describe('gte', () => {
        it('should be greater or equal to', () => {
            let isValid = custom_validators.gte(12, 12);
            assert.isTrue(isValid, '12 is >= 12');
            isValid = custom_validators.gte(12, 11);
            assert.isTrue(isValid, '12 is >= 11');
        });
        it('should not be greater or equal to', () => {
            let isValid = custom_validators.gte(11, 12);
            assert.isFalse(isValid, '11 is not >= 12');
        });
    });
    describe('lte', () => {
        it('should be less than or equal to', () => {
            let isValid = custom_validators.lte(12, 12);
            assert.isTrue(isValid, '12 is >= 12');
            isValid = custom_validators.lte(11, 12);
            assert.isTrue(isValid, '11 is <= 12');
        });
        it('should not be less than or equal to', () => {
            let isValid = custom_validators.lte(12, 11);
            assert.isFalse(isValid, '12 is not <= 11');
        });
    });    
    describe('isNumber', () => {
        it('should be a number', () => {
            let isValid = custom_validators.isNumber("12");
            assert.isTrue(isValid, '"12" is a number');
            isValid = custom_validators.isNumber(12.03);
            assert.isTrue(isValid, '12.03 is a number');
            isValid = custom_validators.isNumber("08");
            assert.isTrue(isValid, '"08" is a number');
        });
        it('should not be a number', () => {
            let isValid = custom_validators.isNumber("b23");
            assert.isFalse(isValid, '"b23" is not a number');
            isValid = custom_validators.isNumber(Infinity);
            assert.isFalse(isValid, 'Infinity is not a number');
            isValid = custom_validators.isNumber();
            assert.isFalse(isValid, '"" is not a number');
        });
    });
    describe('isActualBoolean', () => {
        it('should be a boolean', () => {
            let isValid = custom_validators.isActualBoolean(true);
            assert.isTrue(isValid, 'true is a boolean');
            isValid = custom_validators.isActualBoolean(false);
            assert.isTrue(isValid, 'false is a boolean');
        });
        it('should not be a boolean', () => {
            let isValid = custom_validators.isActualBoolean("b23");
            assert.isFalse(isValid, '"b23" is not a boolean');
            isValid = custom_validators.isActualBoolean("false");
            assert.isFalse(isValid, '"false" is not a boolean');
            isValid = custom_validators.isActualBoolean(0);
            assert.isFalse(isValid, '0 is not a boolean');
            isValid = custom_validators.isActualBoolean(Infinity);
            assert.isFalse(isValid, 'Infinity is not a boolean');
            isValid = custom_validators.isActualBoolean("");
            assert.isFalse(isValid, '"" is not a boolean');
            isValid = custom_validators.isActualBoolean();
            assert.isFalse(isValid, 'null is not a boolean');
        });
    });
    describe('isBooleanString', () => {
        it('should be a boolean string', () => {
            let isValid = custom_validators.isBooleanString("true");
            assert.isTrue(isValid, '"true" is a boolean string');
            isValid = custom_validators.isBooleanString("TRUE");
            assert.isTrue(isValid, '"TRUE" is a boolean string');
            isValid = custom_validators.isBooleanString("False");
            assert.isTrue(isValid, '"False" is a boolean string');
        });
        it('should not be a boolean string', () => {
            let isValid = custom_validators.isBooleanString("b23");
            assert.isFalse(isValid, '"b23" is not a boolean string');
            isValid = custom_validators.isBooleanString(true);
            assert.isFalse(isValid, '"false" is not a boolean v');
            isValid = custom_validators.isBooleanString(0);
            assert.isFalse(isValid, '0 is not a boolean string');
            isValid = custom_validators.isBooleanString("");
            assert.isFalse(isValid, '"" is not a boolean string');
            isValid = custom_validators.isBooleanString();
            assert.isFalse(isValid, 'null is not a boolean string');
        });
    });
    describe('isValidPostalCode', () => {
        it('should be a valid postal code', () => {
            let isValid = custom_validators.isValidPostalCode("M1M1M1");
            assert.isTrue(isValid, '"M1M1M1" is a valid postal code');
            isValid = custom_validators.isValidPostalCode("M1M 1M1");
            assert.isTrue(isValid, '"M1M 1M1" is a valid postal code');
            isValid = custom_validators.isValidPostalCode("m1M 1m1");
            assert.isTrue(isValid, '"m1M 1m1" is a valid postal code');
        });
        it('should not be a valid postal code', () => {
            let isValid = custom_validators.isValidPostalCode("123456");
            assert.isFalse(isValid, '"123456" is not a valid postal code');
            isValid = custom_validators.isValidPostalCode("D3F 4M3");
            assert.isFalse(isValid, '"D3F 4M3" is not a valid postal code');
            isValid = custom_validators.isValidPostalCode("D3F4M3");
            assert.isFalse(isValid, '"D3F4M3" is not a valid postal code');
            isValid = custom_validators.isValidPostalCode(" M1M 1M1 ");
            assert.isFalse(isValid, '" M1M 1M1 " is not a valid postal code');
            isValid = custom_validators.isValidPostalCode();
            assert.isFalse(isValid, '"" is not a valid postal code');
        });
    });
    describe('isValidInvoiceStatus', () => {
        it('should be a valid invoice status', () => {
            let isValid = custom_validators.isValidInvoiceStatus("0");
            assert.isTrue(isValid, '"0" is a valid invoice status');
            isValid = custom_validators.isValidInvoiceStatus(0);
            assert.isTrue(isValid, '0 is a valid invoice status');
            isValid = custom_validators.isValidInvoiceStatus(2);
            assert.isTrue(isValid, '2 is a valid invoice status');
            isValid = custom_validators.isValidInvoiceStatus("2");
            assert.isTrue(isValid, '"2" is a valid invoice status');
        });
        it('should not be a valid invoice status', () => {
            let isValid = custom_validators.isValidInvoiceStatus("3");
            assert.isFalse(isValid, '"3" is not a valid invoice status');
            isValid = custom_validators.isValidInvoiceStatus(1);
            assert.isFalse(isValid, '1 is not a valid invoice status');
            isValid = custom_validators.isValidInvoiceStatus();
            assert.isFalse(isValid, '"" is not a valid invoice status');
        });
    });
    describe('isValidDecimal2Places', () => {
        it('should be a valid 2 decimal point number', () => {
            let isValid = custom_validators.isValidDecimal2Places("0.3");
            assert.isTrue(isValid, '"0.3" is a valid 2 decimal point numbers');
            isValid = custom_validators.isValidDecimal2Places("0.33");
            assert.isTrue(isValid, '"0.33" is a valid 2 decimal point number');
            isValid = custom_validators.isValidDecimal2Places(0.34);
            assert.isTrue(isValid, '0.34 is a valid 2 decimal point number');
        });
        it('should not be a valid 2 decimal point number', () => {
            let isValid = custom_validators.isValidDecimal2Places("3.321");
            assert.isFalse(isValid, '"3.321" is not a valid 2 decimal point number');
            isValid = custom_validators.isValidDecimal2Places(1.342);
            assert.isFalse(isValid, '1.342 is not a valid 2 decimal point number');
            isValid = custom_validators.isValidDecimal2Places("1.d2");
            assert.isFalse(isValid, '"1.d2" is not a valid 2 decimal point number');
            isValid = custom_validators.isValidDecimal2Places();
            assert.isFalse(isValid, '"" is not a valid 2 decimal point number');
        });
    });
    describe('isValidPortingServiceType', () => {
        it('should be a valid porting service type', () => {
            let isValid = custom_validators.isValidPortingServiceType("WIRELESS");
            assert.isTrue(isValid, '"WIRELESS" is a valid porting service type');
            isValid = custom_validators.isValidPortingServiceType("wireline");
            assert.isTrue(isValid, '"wireline" is a valid porting service type');
        });
        it('should not be a valid porting service type', () => {
            let isValid = custom_validators.isValidPortingServiceType("Wirelin");
            assert.isFalse(isValid, '"Wirelin" is not a valid porting service type');
            isValid = custom_validators.isValidPortingServiceType();
            assert.isFalse(isValid, '"" is not a valid porting service type');
        });
    });
    describe('isValidAdjustmentType', () => {
        it('should be a valid adjustment type', () => {
            let isValid = custom_validators.isValidAdjustmentType("BALANCEMIGR");
            assert.isTrue(isValid, '"BALANCEMIGR" is a valid adjustment type');
            isValid = custom_validators.isValidAdjustmentType("CRED");
            assert.isTrue(isValid, '"CRED" is a valid adjustment type');
            isValid = custom_validators.isValidAdjustmentType("DEP");
            assert.isTrue(isValid, 'DEP is a valid adjustment type');
            isValid = custom_validators.isValidAdjustmentType("EC");
            assert.isTrue(isValid, 'EC is a valid adjustment type');
            isValid = custom_validators.isValidAdjustmentType("misc");
            assert.isTrue(isValid, 'MISC is a valid adjustment type');
        });
        it('should not be a valid adjustment type', () => {
            let isValid = custom_validators.isValidAdjustmentType("CHEQUE");
            assert.isFalse(isValid, '"CHEQUE" is not a valid adjustment type');
            isValid = custom_validators.isValidAdjustmentType();
            assert.isFalse(isValid, '"" is not a valid adjustment type');
        });
    });
    describe('isValidBalanceType', () => {
        it('should be a valid balance type', () => {
            let isValid = custom_validators.isValidBalanceType("ACCOUNT");
            assert.isTrue(isValid, '"ACCOUNT" is a valid balance type');
            isValid = custom_validators.isValidBalanceType("tab");
            assert.isTrue(isValid, '"tab" is a valid balance type');
            isValid = custom_validators.isValidBalanceType("MONEYWALLET");
            assert.isTrue(isValid, 'MONEYWALLET is a valid balance type');
        });
        it('should not be a valid balance type', () => {
            let isValid = custom_validators.isValidBalanceType("DEBIT");
            assert.isFalse(isValid, '"DEBIT" is not a valid balance type');
            isValid = custom_validators.isValidBalanceType();
            assert.isFalse(isValid, '"" is not a valid balance type');
        });
    });
    describe('isValidTelephoneNumber (must start with a leading 1)', () => {
        it('should be a valid telephone number', () => {
            let isValid = custom_validators.isValidTelephoneNumber("14167635463");
            assert.isTrue(isValid, '"14167635463" is a valid telephone number');
            isValid = custom_validators.isValidTelephoneNumber("15463335463");
            assert.isTrue(isValid, '"15463335463" is a valid telephone number');
        });
        it('should not be a valid telephone number', () => {
            let isValid = custom_validators.isValidTelephoneNumber("4165352534");
            assert.isFalse(isValid, '"4165352534" is not a valid telephone number');
            isValid = custom_validators.isValidTelephoneNumber("11652352534");
            assert.isFalse(isValid, '"11652352534" is not a valid telephone number');
            isValid = custom_validators.isValidTelephoneNumber();
            assert.isFalse(isValid, '"" is not a valid telephone number');
        });
    });
    describe('isValidTelephoneNumberArray (each number must start with a leading 1)', () => {
        it('should be a valid telephone number array', () => {
            let isValid = custom_validators.isValidTelephoneNumberArray(["14167635463", "15463335463"]);
            assert.isTrue(isValid, '["14167635463","15463335463"] is a valid telephone number array');
            isValid = custom_validators.isValidTelephoneNumberArray(["15463335463"]);
            assert.isTrue(isValid, '["15463335463"] is a valid telephone number array');
        });
        it('should not be a valid telephone number array', () => {
            let isValid = custom_validators.isValidTelephoneNumberArray(["4165352534"]);
            assert.isFalse(isValid, '["4165352534"] is not a valid telephone number array');
            isValid = custom_validators.isValidTelephoneNumberArray(["11652352534"]);
            assert.isFalse(isValid, '["11652352534"] is not a valid telephone number array');
            isValid = custom_validators.isValidTelephoneNumberArray(["14265345464", "4165352534"]);
            assert.isFalse(isValid, '["14265345464","4165352534"] is not a valid telephone number array');
            isValid = custom_validators.isValidTelephoneNumberArray(["14265345464", "acb2376243"]);
            assert.isFalse(isValid, '["14265345464","acb2376243"] is not a valid telephone number array');
            isValid = custom_validators.isValidTelephoneNumberArray([]);
            assert.isFalse(isValid, '[] is not a valid telephone number array');
            isValid = custom_validators.isValidTelephoneNumberArray({});
            assert.isFalse(isValid, '{} is not a valid telephone number array');
        });
    });
    describe('isValidStreetSuffix', () => {
        it('should be a valid street suffix', () => {
            let isValid = custom_validators.isValidStreetSuffix("St");
            assert.isTrue(isValid, '"St" is a valid street suffix');
            isValid = custom_validators.isValidStreetSuffix("091 Rd");
            assert.isTrue(isValid, '"091 Rd" is a valid street suffix');
        });
        it('should not be a valid street suffix', () => {
            let isValid = custom_validators.isValidStreetSuffix("St.");
            assert.isFalse(isValid, '"St." is not a valid street suffix');
            isValid = custom_validators.isValidStreetSuffix("R-Road");
            assert.isFalse(isValid, '"R-Road" is not a valid street suffix');
            isValid = custom_validators.isValidStreetSuffix();
            assert.isFalse(isValid, '"" is not a valid street suffix');
        });
    });
    describe('isValidStreetName', () => {
        it('should be a valid street name', () => {
            let isValid = custom_validators.isValidStreetName("Jane");
            assert.isTrue(isValid, '"Jane" is a valid street name');
            isValid = custom_validators.isValidStreetName("West 86th");
            assert.isTrue(isValid, '"West 86th" is a valid street name');
        });
        it('should not be a valid street name', () => {
            let isValid = custom_validators.isValidStreetName("West-50th");
            assert.isFalse(isValid, '"West-50th" is not a valid street name');
            isValid = custom_validators.isValidStreetName("Jane#");
            assert.isFalse(isValid, '"Jane#" is not a valid street name');
            isValid = custom_validators.isValidStreetName();
            assert.isFalse(isValid, '"" is not a valid street name');
        });
    });
    describe('isValidUnitNumber', () => {
        it('should be a valid unit number', () => {
            let isValid = custom_validators.isValidUnitNumber("143");
            assert.isTrue(isValid, '"143" is a valid unit number');
            isValid = custom_validators.isValidUnitNumber("A");
            assert.isTrue(isValid, '"A" is a valid unit number');
            isValid = custom_validators.isValidUnitNumber("A123");
            assert.isTrue(isValid, '"A123" is a valid unit number');
            isValid = custom_validators.isValidUnitNumber();
            assert.isTrue(isValid, '"" is a valid unit number');
            isValid = custom_validators.isValidUnitNumber(null);
            assert.isTrue(isValid, 'null is a valid unit number');
        });
        it('should not be a valid unit number', () => {
            let isValid = custom_validators.isValidUnitNumber("A-123");
            assert.isFalse(isValid, '"A-123" is not a valid unit number');
            isValid = custom_validators.isValidUnitNumber("A 123");
            assert.isFalse(isValid, '"A 123" is not a valid unit number');
        });
    });
    describe('isValidAccountStatus', () => {
        it('should be a valid account status', () => {
            let isValid = custom_validators.isValidAccountStatus("NEW");
            assert.isTrue(isValid, '"NEW" is a valid account status');
            isValid = custom_validators.isValidAccountStatus("ACTIVE");
            assert.isTrue(isValid, '"ACTIVE" is a valid account status');
            isValid = custom_validators.isValidAccountStatus("SUSPENDED");
            assert.isTrue(isValid, '"SUSPENDED" is a valid account status');
            isValid = custom_validators.isValidAccountStatus("closed");
            assert.isTrue(isValid, '"closed" is a valid account status');
        });
        it('should be an invalid account status', () => {
            let isValid = custom_validators.isValidAccountStatus("OPEN");
            assert.isFalse(isValid, '"OPEN" is not a valid account status');
            isValid = custom_validators.isValidAccountStatus("DONE");
            assert.isFalse(isValid, '"DONE" is not a valid account status');
            isValid = custom_validators.isValidAccountStatus();
            assert.isFalse(isValid, '"" is not a valid account status');
        });
    });
    describe('isValidFullNumber (must start with a leading 1)', () => {
        it('should be a valid full number', () => {
            let isValid = custom_validators.isValidFullNumber("14167635463");
            assert.isTrue(isValid, '"14167635463" is a valid full number');
            isValid = custom_validators.isValidFullNumber("15463335463");
            assert.isTrue(isValid, '"15463335463" is a valid full number');
        });
        it('should not be a valid full number', () => {
            let isValid = custom_validators.isValidFullNumber("4165352534");
            assert.isFalse(isValid, '"4165352534" is not a valid full number');
            isValid = custom_validators.isValidFullNumber("11652352534");
            assert.isFalse(isValid, '"11652352534" is not a valid full number');
            isValid = custom_validators.isValidFullNumber();
            assert.isFalse(isValid, '"" is not a valid full number');
        });
    });
    describe('arrayNotEmpty', () => {
        it('should be a non-empty array', () => {
            let isValid = custom_validators.arrayNotEmpty([1, 2]);
            assert.isTrue(isValid, '[1,2] is a non-empty array');
        });
        it('should not be an empty or invalid array', () => {
            let isValid = custom_validators.arrayNotEmpty([]);
            assert.isFalse(isValid, '[] is an empty or invalid array');
            isValid = custom_validators.arrayNotEmpty({});
            assert.isFalse(isValid, '{} is an empty or invalid array');
            isValid = custom_validators.arrayNotEmpty();
            assert.isFalse(isValid, 'null    is an empty or invalid array');
        });
    });
    describe('isYesOrNo', () => {
        it('should be a YES or NO', () => {
            let isValid = custom_validators.isYesOrNo("YES");
            assert.isTrue(isValid, '"YES" is YES or NO');
            isValid = custom_validators.isYesOrNo("no");
            assert.isTrue(isValid, '"no" is YES or NO');
        });
        it('should not be YES or NO', () => {
            let isValid = custom_validators.isYesOrNo("blah");
            assert.isFalse(isValid, '"blah" is not YES or NO');
            isValid = custom_validators.isYesOrNo();
            assert.isFalse(isValid, '"" is not YES or NO');
        });
    });
    describe('gt', () => {
        it('should be greater than', () => {
            let isValid = custom_validators.gt(13, 12);
            assert.isTrue(isValid, '13 is > 12');
            isValid = custom_validators.gt(12, 11);
            assert.isTrue(isValid, '12 is > 11');
        });
        it('should not be greater than', () => {
            let isValid = custom_validators.gt(11, 12);
            assert.isFalse(isValid, '11 is not > 12');
            isValid = custom_validators.gt(12, 12);
            assert.isFalse(isValid, '12 is not > 12');
        });
    });
    describe('lt', () => {
        it('should be less than', () => {
            let isValid = custom_validators.lt(12, 13);
            assert.isTrue(isValid, '12 is < 13');
            isValid = custom_validators.lt(11, 12);
            assert.isTrue(isValid, '11 is > 12');
        });
        it('should not be less than', () => {
            let isValid = custom_validators.lt(12, 11);
            assert.isFalse(isValid, '12 is not < 11');
            isValid = custom_validators.lt(12, 12);
            assert.isFalse(isValid, '12 is not < 12');
        });
    });    
    describe('isInteger', () => {
        it('should be an integer', () => {
            let isValid = custom_validators.isInteger(1);
            assert.isTrue(isValid, '1 is an integer');
            isValid = custom_validators.isInteger(2);
            assert.isTrue(isValid, '2 is an integer');
        });
        it('should not be an integer', () => {
            let isValid = custom_validators.isInteger(1.9);
            assert.isFalse(isValid, '1.9 is not an integer');
            isValid = custom_validators.isInteger("1");
            assert.isFalse(isValid, '"1" is not an integer');
            isValid = custom_validators.isInteger("0.8");
            assert.isFalse(isValid, '"0.8" is not an integer');
            isValid = custom_validators.isInteger("a");
            assert.isFalse(isValid, '"a" is not an integer');
            isValid = custom_validators.isInteger();
            assert.isFalse(isValid, 'null is not an integer');
        });
    });
    describe('isValidUrl (must start with http or https)', () => {
        it('should be a valid url', () => {
            let isValid = custom_validators.isValidUrl("http://www.cnn.com");
            assert.isTrue(isValid, '"http://www.cnn.com" is a valid url');
            isValid = custom_validators.isValidUrl("https://www.blahblah.ca");
            assert.isTrue(isValid, '"https://www.blahblah.ca" is a valid url');
        });
        it('should not be a valid url', () => {
            let isValid = custom_validators.isValidUrl("ht:/www.hey.com");
            assert.isFalse(isValid, '"ht:/www.hey.com" is not a valid url');
            isValid = custom_validators.isValidUrl("www.htyeu.com");
            assert.isFalse(isValid, '"www.htyeu.com" is not a valid url');
            isValid = custom_validators.isValidUrl();
            assert.isFalse(isValid, '"" is not a valid url');
        });
    });
    
    describe('isValidSecureUrl (must start with https)', () => {
        it('should be a valid secure url', () => {
            let isValid = custom_validators.isValidSecureUrl("https://www.cnn.com");
            assert.isTrue(isValid, '"https://www.cnn.com" is a valid secure url');
        });
        it('should not be a valid secure url', () => {
            let isValid = custom_validators.isValidSecureUrl("ht:/www.hey.com");
            assert.isFalse(isValid, '"ht:/www.hey.com" is not a valid secure url');
            isValid = custom_validators.isValidSecureUrl("http://www.htyeu.com");
            assert.isFalse(isValid, '"http://www.htyeu.com" is not a valid secure url');
            isValid = custom_validators.isValidSecureUrl();
            assert.isFalse(isValid, ' is not a valid secure url');
        });
    });
    describe('isPositive', () => {
        it('should be a postive number', () => {
            let isValid = custom_validators.isPositive(12.12);
            assert.isTrue(isValid, '12.12 is a postive number');
            isValid = custom_validators.isPositive(4);
            assert.isTrue(isValid, '4 is a postive number');
        });
        it('should not be a postive number', () => {
            let isValid = custom_validators.isPositive(-2);
            assert.isFalse(isValid, '-2 is not a postive number');
            isValid = custom_validators.isPositive(-0.4);
            assert.isFalse(isValid, '-0.4 is not a postive number');
            isValid = custom_validators.isPositive("-1.9");
            assert.isFalse(isValid, '"-1.9" is not a postive number');
            isValid = custom_validators.isPositive();
            assert.isFalse(isValid, '"" is not a postive number');
        });
    });
    describe('isValidDepositType', () => {
        it('should be a valid deposit type', () => {
            let isValid = custom_validators.isValidDepositType("SECDEPOSIT");
            assert.isTrue(isValid, '"SECDEPOSIT" is a valid deposit type');
            isValid = custom_validators.isValidDepositType("secdeposit");
            assert.isTrue(isValid, '"secdeposit" is a valid deposit type');
        });
        it('should not be a valid deposit type', () => {
            let isValid = custom_validators.isValidDepositType("CRED");
            assert.isFalse(isValid, '"CED" is not a valid deposit type');
            isValid = custom_validators.isValidDepositType();
            assert.isFalse(isValid, '"" is not a valid deposit type');
        });
    });
    describe('isObject', () => {
        it('should be a valid object', () => {
            let isValid = custom_validators.isObject({key:"value"});
            assert.isTrue(isValid, '"{key:\"value\"}" is a valid object');
        });
        it('should not be an invalid object', () => {
            let isValid = custom_validators.isObject("CRED");
            assert.isFalse(isValid, '"CRED" is an invalid object');
            isValid = custom_validators.isObject();
            assert.isFalse(isValid, ' is an invalid object');
        });
    });
    describe('isNotObject', () => {
        it('should not be an invalid object', () => {
            let isValid = custom_validators.isNotObject();
            assert.isTrue(isValid, ' is an invalid object');
            isValid = custom_validators.isNotObject("");
            assert.isTrue(isValid, '"" is an invalid object');
        });
        it('should not be an object', () => {
            let isValid = custom_validators.isNotObject({key:"value"});
            assert.isFalse(isValid, '{key:"value"} is not a invalid object');
        });
    }); 
    describe('isValidBillingType', () => {
        it('should be a valid billing type', () => {
            let isValid = custom_validators.isValidBillyngType("POSTPAID");
            assert.isTrue(isValid, '"POSTPAID" is a valid billing type');
            isValid = custom_validators.isValidBillyngType("postpaid");
            assert.isTrue(isValid, '"postpaid" is a valid billing type');
        });
        it('should be an invalid billing type', () => {
            let isValid = custom_validators.isValidBillyngType("paid");
            assert.isFalse(isValid, '"paid" not is a valid billing type');
            isValid = custom_validators.isValidBillyngType();
            assert.isFalse(isValid, '"" is not a valid billing type');
        });
    });        
});