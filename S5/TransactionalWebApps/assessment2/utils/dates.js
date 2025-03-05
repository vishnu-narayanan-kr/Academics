"use strict";

module.exports = {
  /**
   * Returns TRUE if date is in the required format and is a valid date.  FALSE otherwise.
   *
   * @param {String} dateString in YYYY-MM-DD format
   */
  isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) {
      return false; // Invalid format
    }
    const d = new Date(dateString);
    if (!d.getTime()) {
      return false; // Invalid date (or this could be epoch)
    }
    return d.toISOString().slice(0, 10) === dateString;
  },

  /**
   * Returns the date in YYYY-MM-DD format.  NULL otherwise.
   *
   * @param {number|string|date} date in YYYYMMDD format or actual Date instance
   */
  formatDate(date) {
    if (!date || typeof date === "undefined") {
      return null;
    }
    if (date instanceof Date) {
      let dateMonth = "" + (date.getMonth() + 1);
      let dateDay = "" + date.getDate();
      const dateYear = date.getFullYear();

      if (dateMonth.length < 2) {
        dateMonth = "0" + dateMonth;
      }
      if (dateDay.length < 2) {
        dateDay = "0" + dateDay;
      }
      return [dateYear, dateMonth, dateDay].join("-");
    } else {
      date = date + "";
      if (/(\d{4})-(\d{2})-(\d{2})$/.test(date)) {
        return date;
      }
      if (!/(\d{4})(\d{2})(\d{2})$/.test(date)) {
        return null;
      }
      const [orig, year, month, day] = date.match(/(\d{4})(\d{2})(\d{2})$/);
      return [year, month, day].join("-");
    }
  },

  /**
   * Returns date passed in or todays date in YYYYMMDD format.
   *
   */
  yyyymmdd(date = null) {
    const now = date ? new Date(date) : new Date();
    const yyyy = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const mm = m < 10 ? "0" + m : m;
    const dd = d < 10 ? "0" + d : d;
    return "" + yyyy + mm + dd;
  }
};
