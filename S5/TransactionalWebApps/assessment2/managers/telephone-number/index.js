"use strict";

const debug = require("debug")("manager:telephone-number");
const debugTiming = require("debug")("timing");
const db = require("./../../database");
const logger = require("./../../logger")(module);
const {genericError} = require("./../../utils/error");
const { NS_PER_SEC } = require("./../../utils/constants");

/**
 * Class that handles any/all functionality related to telephone numbers.
 */
module.exports = {
  /**
   * Return catalogue of available numbers.
   *
   * @param {object} params
   * {
   *    @param {string} city(optional)  The city or cities (comma-delimited) to find numbers for.
   *    @param {string} province(optional)  The province or provinces (comma-delimited)  to find numbers for.
   *    @param {string} country(optional)  The country to find numbers for.
   *    @param {string} areaCode(optional)  Find numbers matching the provided areaCode or areaCodes (comma-delimited).
   *    @param {string} exchangeCode(optional)  Find numbers matching the provided exchangeCode or exchangeCodes (comma-delimited).
   *    @param {string} lineNumber(optional)  Find numbers matching the provided lineNumber.
   *    @param {string} businessUnitId(required) Business Unit ID to get numbers for.
   * }
   */
  async getCatalogue(params = {}) {
    logger.info("TelephoneNumberManager getCatalogue");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnitId === "undefined") {
      throw genericError({
        message:
          "Get telephone number catalogue failed due to: Required businessUnit is missing.",
        status: 400,
        code: 400,
        type: "TelephoneNumberError"
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `SELECT areaCode, exchangeCode FROM locales WHERE JSON_CONTAINS(locales.businessUnits, ?) `;
      let values = [`[${params.businessUnitId}]`];
      const response = await connection.query(query, values);
      if (response[0].length === 0) {
        return {};
      }
      const locales = response[0];
      query = `SELECT * FROM telephoneNumbers INNER JOIN cities ON (telephoneNumbers.cityId = cities.id) WHERE telephoneNumbers.businessUnitId IS NULL AND telephoneNumbers.serviceId IS NULL`;
      // AND (telephoneNumbers.lastUsed IS NULL OR date_format(telephoneNumbers.lastUsed, '%Y-%m-%d') < date_format(CURRENT_DATE - INTERVAL 90 DAY, '%Y-%m-%d'))`;
      values = [params.businessUnitId];
      query += " AND (";
      locales.forEach((locale, index) => {
        query += ` (telephoneNumbers.areaCode = "${locale.areaCode}" AND telephoneNumbers.exchangeCode = "${locale.exchangeCode}")`;
        if (index < locales.length - 1) {
          query += ` OR`;
        }
      });
      query += " )";
      if (params.city) {
        query += ` AND telephoneNumbers.city IN (?)`;
        values.push(params.city.split(","));
      }
      if (params.areaCode) {
        query += ` AND telephoneNumbers.areaCode IN (?)`;
        values.push(params.areaCode.split(","));
      }
      if (params.province) {
        query += ` AND telephoneNumbers.province IN (?)`;
        values.push(params.province.split(","));
      }
      if (params.country) {
        query += ` AND telephoneNumbers.country = ?`;
        values.push(params.country);
      }
      if (params.exchangeCode) {
        query += ` AND telephoneNumbers.exchangeCode IN (?)`;
        values.push(params.exchangeCode.split(","));
      }
      if (params.lineNumber) {
        query += ` AND telephoneNumbers.lineNumber = ?`;
        values.push(params.lineNumber);
      }
      const numbers = await connection.query(query, values);
      const availableList = numbers[0] || [];
      const catalogue = {};
      availableList.forEach(number => {
        const hasCountry = !!catalogue[number.country];
        const hasProvince =
          hasCountry && !!catalogue[number.country][number.province];
        const hasCity =
          hasProvince &&
          !!catalogue[number.country][number.province][number.city];
        const hasAreaCode =
          hasCity &&
          !!catalogue[number.country][number.province][number.city][
            number.areaCode
          ];
        const hasExchangeCode =
          hasAreaCode &&
          !!catalogue[number.country][number.province][number.city][
            number.areaCode
          ][number.exchangeCode];
        if (!hasCountry) {
          catalogue[number.country] = {};
        }
        if (!hasProvince) {
          catalogue[number.country][number.province] = {};
        }
        if (!hasCity) {
          catalogue[number.country][number.province][number.city] = {
            // geo_code: {
            //   lat: number.lat,
            //   lng: number.lng
            // }
          };
        }
        if (!hasAreaCode) {
          catalogue[number.country][number.province][number.city][
            number.areaCode
          ] = {};
        }
        if (!hasExchangeCode) {
          catalogue[number.country][number.province][number.city][
            number.areaCode
          ][number.exchangeCode] = [];
        }
        catalogue[number.country][number.province][number.city][
          number.areaCode
        ][number.exchangeCode].push(parseInt(number.fullNumber));
        catalogue[number.country][number.province][number.city][
          number.areaCode
        ][number.exchangeCode].sort();
      });
      return catalogue;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `TelephoneNumberManager getCatalogue took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Find all reserved telephone numbers.
   *
   * @param {object} params
   * {
   *    @param {boolean} inUse(optional)  If true returns reserved telephone numbers that are in use by services. If
   *      false returns reserved telephone numbers that are not in use by services. If not provided, returns telephone
   *      numbers both in use and not in use by services.
   *    @param {boolean} checkLastUsed(optional) If true, validate against 90 day rule of last used.
   *    @param {string} lastUsed(optional) In format YYYY-MM-DD.
   *    @param {string} city(optional)  The city or cities (comma-delimited) to find numbers for.
   *    @param {string} province(optional)  The province or provinces (comma-delimited)  to find numbers for.
   *    @param {string} country(optional)  The country to find numbers for.
   *    @param {string} areaCode(optional)  Find numbers matching the provided areaCode or areaCodes (comma-delimited).
   *    @param {string} exchangeCode(optional)  Find numbers matching the provided exchangeCode or exchangeCodes (comma-delimited).
   *    @param {string} lineNumber(optional)  Find numbers matching the provided lineNumber.
   *    @param {string} fullNumber(optional)  Find numbers matching the provided fullNumber.
   *    @param {string} businessUnitId(required) Business Unit ID to get numbers for.
   *    @param {number} page(optional) Defaults to 1.
   *    @param {number} pageLimit(optional) Defaults to 10.
   * }
   */
  async getReservedNumbers(params = {}) {
    logger.info("TelephoneNumberManager getReservedNumbers");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnitId === "undefined") {
      throw genericError({
        message:
          "Get reserved telephone numbers failed due to: Required businessUnit is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      // TODO: remove this when dev db is moved to  AWS
      if (process.env.NODE_ENV !== "production") {
        await connection.query(`SET group_concat_max_len = 100000`);
      }
      const countQuery = `SELECT COUNT(*) as count`;
      let detailsQuery = `SELECT *`;
      let query = `FROM telephoneNumbers INNER JOIN cities ON (telephoneNumbers.cityId = cities.id) WHERE telephoneNumbers.businessUnitId = ?`;
      const values = [params.businessUnitId];
      if (params.city) {
        query += ` AND telephoneNumbers.city IN (?)`;
        values.push(params.city.split(","));
      }
      if (params.areaCode) {
        query += ` AND telephoneNumbers.areaCode IN (?)`;
        values.push(params.areaCode.split(","));
      }
      if (params.province) {
        query += ` AND telephoneNumbers.province IN (?)`;
        values.push(params.province.split(","));
      }
      if (params.country) {
        query += ` AND telephoneNumbers.country = ?`;
        values.push(params.country);
      }
      if (params.exchangeCode) {
        query += ` AND telephoneNumbers.exchangeCode IN (?)`;
        values.push(params.exchangeCode.split(","));
      }
      if (params.lineNumber) {
        query += ` AND telephoneNumbers.lineNumber = ?`;
        values.push(params.lineNumber);
      }
      if (params.fullNumber) {
        query += ` AND telephoneNumbers.fullNumber = ?`;
        values.push(params.fullNumber);
      }
      if (typeof params.inUse !== "undefined") {
        if (!!params.inUse) {
          query += ` AND telephoneNumbers.serviceId IS NOT NULL`;
        } else {
          query += ` AND telephoneNumbers.serviceId IS NULL`;
        }
      }
      let useLastUsed = false;
      if (params.lastUsed) {
        useLastUsed = true;
        query += ` AND (telephoneNumbers.lastUsed < "${params.lastUsed}" OR telephoneNumbers.lastUsed IS NULL)`;
      }
      // if (typeof params.checkLastUsed !== "undefined" && !!params.checkLastUsed) {
      //   query += ` AND (telephoneNumbers.lastUsed IS NULL OR date_format(telephoneNumbers.lastUsed, '%Y-%m-%d') < date_format(CURRENT_DATE - INTERVAL 90 DAY, '%Y-%m-%d'))`;
      // }
      const [pagination, _fields] = await connection.query(
        `${countQuery} ${query}`,
        values
      );
      const count = pagination[0].count;
      const page = parseInt(params.page || 1);
      const pageLimit = parseInt(params.pageLimit || process.env.PAGE_LIMIT);
      values.push(pageLimit, (page - 1) * pageLimit);
      let useGeoCode = false;
      if (
        typeof params.lat !== "undefined" &&
        typeof params.lng !== "undefined"
      ) {
        useGeoCode = true;
        detailsQuery += `, (6371 
            * acos(
                cos(radians(${params.lat})) 
                * cos(radians(cities.lat))
                * cos(radians(cities.lng) - radians(${params.lng})) 
                + sin(radians(${params.lat}))
                * sin(radians(cities.lat))
              )
        ) AS distance`;
      }
      let orderBy = `ORDER BY `;
      if (useGeoCode) {
        orderBy += `distance ASC`;
      }
      if (useLastUsed) {
        orderBy += `${useGeoCode ? ", " : ""}lastUsed`;
      }
      const [numbers, _notused] = await connection.query(
        `${detailsQuery} ${query} ${
          useGeoCode || useLastUsed ? orderBy : ""
        } LIMIT ? OFFSET ?`,
        values
      );

      return {
        total: count,
        totalPages: Math.ceil(count / pageLimit) || 0,
        pageLimit,
        page,
        numbers: numbers || []
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `TelephoneNumberManager getReservedNumbers took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Reserved telephone numbers.
   *
   * @param {object} params
   * {
   *      @param {array} telephoneNumbers(required)  Array of telephone numbers to reserve
   *      @param {string} businessUnitId(required) Business Unit ID to reserve numbers for.
   * }
   */
  async reserveNumbers(params = {}) {
    logger.info("TelephoneNumberManager reserveNumbers");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.telephoneNumbers === "undefined" ||
      typeof params.businessUnitId === "undefined"
    ) {
      throw genericError({
        message:
          "Reserved telephone numbers failed due to: Required telephoneNumbers and/or businessUnitId are missing",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      params.telephoneNumbers = params.telephoneNumbers.map(
        number => "" + number
      );
      connection = await db.getIristelXConnection();
      let query = `UPDATE telephoneNumbers SET telephoneNumbers.businessUnitId = ? WHERE 
        telephoneNumbers.businessUnitId IS NULL AND telephoneNumbers.fullNumber IN (?)`;
      const values = [params.businessUnitId, params.telephoneNumbers];
      let result = await connection.query(query, values);
      query = `SELECT fullNumber FROM telephoneNumbers WHERE 
        telephoneNumbers.businessUnitId = ? AND telephoneNumbers.fullNumber IN (?)`;
      result = await connection.query(query, values);
      const reserved = [];
      const nonreserved = params.telephoneNumbers;
      (result[0] || []).forEach(number => {
        let index = params.telephoneNumbers.indexOf(number.fullNumber);
        if (index > -1) {
          reserved.push(number.fullNumber);
          nonreserved.splice(index, 1);
        }
      });
      return {
        reserved,
        nonreserved
      };
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `TelephoneNumberManager reserveNumbers took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Release telephone numbers.
   *
   * @param {object} params
   * {
   *      @param {string} telephoneNumber(required)  Telephone number to release
   *      @param {string} businessUnitId(required) Business Unit ID to release number for.
   * }
   */

  async releaseNumber(params) {
    logger.info("TelephoneNumberManager releaseNumber");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnitId === "undefined") {
      throw genericError({
        message:
          "Release telephone number failed due to: Required businessUnitId is missing.",
        status: 400,
        code: 400
      });
    }
    let connection;
    try {
      connection = await db.getIristelXConnection();
      let query = `UPDATE telephoneNumbers SET telephoneNumbers.businessUnitId = NULL WHERE 
        telephoneNumbers.businessUnitId = ? AND telephoneNumbers.fullNumber = ? AND telephoneNumbers.serviceId IS NULL`;
      const values = [params.businessUnitId, params.telephoneNumber];
      let result = await connection.query(query, values);
      result = result[0] || {};
      if (!!result.changedRows) {
        return {
          message: `Number: ${params.telephoneNumber} was successfully released.`
        };
      } else {
        throw genericError({
          message: `Number: ${params.telephoneNumber} was not successfully released.  
          Make sure the number is correct, is assigned to your business unit and is not in use.`,
          status: 400,
          code: 400
        });
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `TelephoneNumberManager releaseNumber took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
