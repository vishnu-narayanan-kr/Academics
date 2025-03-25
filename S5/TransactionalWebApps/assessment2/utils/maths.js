"use strict";

module.exports = {
  /**
   * Rounds the specified number to the specified digits.
   * 
   * @param {Number} value The number to round off. Default is 0.
   * @param {Number} digits The number of digits to round to. Default is 2.
   */
  round(value = 0, digits = 2) {
    return Number(Math.round(value + "e" + digits) + "e-" + digits);
  }
};