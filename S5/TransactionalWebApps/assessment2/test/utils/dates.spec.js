"use strict";
const chai = require("chai");
const date_utils = require("./../../utils/dates");
const assert = chai.assert;
describe('Date Utils Tests', () => {
    describe('isValidDate', () => {
        it('should be a valid date', () => {
            let isValid = date_utils.isValidDate("1999-01-29");
            assert.isTrue(isValid, 'the date 1999-01-29 is valid');
        });
        it('should be an invalid date', () => {
            let isValid = date_utils.isValidDate("1999-01-32");
            assert.isFalse(isValid, 'the date 1999-01-32 is invalid');
            isValid = date_utils.isValidDate("19990132");
            assert.isFalse(isValid, 'the date 19990132 is invalid');
        });
    });
    describe('formatDate', () => {
        it('should format valid date string with no hypens', () => {
            let date = date_utils.formatDate("19990129");
            assert.equal(date, "1999-01-29", '19990129 can be formatted properly');
        });
        it('should format valid date string with hyphens', () => {
            let date = date_utils.formatDate("1999-01-29");
            assert.equal(date, "1999-01-29", '1999-01-29 can be formatted properly');
        });
        it('should format valid date object', () => {
            let date = date_utils.formatDate(new Date("1999-12-08"));
            assert.isNotNull(date, 'custom date object => new Date("1999-12-08") can be formatted properly');
        });
        it('should format valid date object', () => {
            let date = new Date();
            date.setFullYear(1999);
            date.setMonth(1);
            date.setDate(3);
            date = date_utils.formatDate(date);
            assert.isNotNull(date, 'custom date object => new Date("1999-02-03") can be formatted properly');
        });

        it('should format valid default date object', () => {
            let date = date_utils.formatDate(new Date());
            assert.isNotNull(date, 'default date object can be formatted properly');
        });
        it('should not be able to format null/undefined date', () => {
            let date = date_utils.formatDate(null);
            assert.isNull(date, 'A null/undefined date cannot be formatted');
        });
        it('should not be able to format invalid date', () => {
            let date = date_utils.formatDate("199-01-32");
            assert.equal(date, null, 'the date 199-01-32 cannot be formatted');
        });
    });
});