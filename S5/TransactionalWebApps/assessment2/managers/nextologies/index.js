"use strict";

const debug = require("debug")("manager:nextologies");
const debugTiming = require("debug")("timing");
const logger = require("./../../logger")(module);
const { nextologiesService } = require("./../../services");
const { genericError } = require("./../../utils/error");
const { NS_PER_SEC } = require("./../../utils/constants");

const parseObjectParams = (operation, data, obj) => {
  let keys = Object.keys(operation);
  (keys || []).map(key => {
    let value = operation[key];
    if (typeof value === "string") {
      let tmpValue = value;
      const placeholders = value.match(/[^<]+(?=>)/g);
      let tmp = "";
      if (placeholders) {
        placeholders.forEach(placeholder => {
          const parsed = placeholder.split(".");
          if (parsed.length === 1) {
            switch (parsed[0].toLowerCase()) {
              default:
                tmp = data[parsed[0]];
            }
          } else {
            tmp = parsed.reduce((acc, cv, i, arr) => {
              if (typeof acc[cv] === "undefined") {
                arr.splice(--i);
                return acc;
              } else {
                return acc[cv];
              }
            }, data);
          }
          const re = new RegExp(`<${placeholder}>`, "g");
          tmpValue = tmpValue.replace(re, tmp);
        });
      }
      obj[key] = tmpValue;
    } else if (typeof value === "boolean" || typeof value === "number") {
      obj[key] = value;
    } else {
      obj[key] = parseObjectParams(value, data, {});
    }
  });
  return obj;
};

const generateRequestObject = (operation, data, obj) => {
  // (operations || []).map(operation => {
  obj = parseObjectParams(operation, data, obj);
  // });
  logger.info(obj);
  return obj;
};

/**
 * Class that handles any/all functionality related to Nextologies.
 */
module.exports = {
  /**
   * Execute nextologies request(s).
   *
   * @param {object} params
   * {
   *    @param {object} contact(optional) {
   *      @param {string} fname(required)  The firstname of the contact/customer.
   *      @param {string} lname(required)  The lastname of the contact/customer.
   *      @param {string} emailAddress(required)  The email of the contact/customer.
   *       ...
   *      }
   *    }
   *    @param {string} origEmailAddress(optional) Only included if email has changed.
   *    @param {string} customerId(optional)
   *    @param {string} packageId(optional)
   *    @param {string} addonId(optional)
   *    @param {array} operations(required) {
   *    }
   *    @param {object} businessUnit(required) Object describing all config for the business unit needed to call required
   *        services.
   * }
   */
  async execute(params = {}) {
    logger.info("NextologiesManager execute");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.operations === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message:
          "NextologiesManager execute failed due to: One of required operations, and/or businessUnit are missing.",
        status: 400,
        code: 400
      });
    }

    try {
      if (!params.customerId) {
        let customersResponse = await this.getCustomers({
          contact: params.contact,
          origEmailAddress: params.origEmailAddress,
          businessUnit: params.businessUnit
        });
        if (customersResponse.customers.length) {
          params.customerId = customersResponse.customers[0].customerId;
        } else {
          // if (!params.origEmailAddress) {
          const customer = await this.createCustomer({
            contact: params.contact,
            businessUnit: params.businessUnit
          });
          params.customerId = customer.customerId;
          //           }
          //           else {
          //             return;
          //           }
        }
      }
      for (let i = 0; i < params.operations.length; i++) {
        return await nextologiesService.makeRequest(
          generateRequestObject(params.operations[i], params, {})
        );
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `NextologiesManager execute took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },

  /**
   * Get a customer from Nextologies.
   *
   * @param {object} params
   * {
   *    @param {object} contact(optional)  The contact object.
   *    @param {string} origEmailAddress(optional) Only included if contact email has changed.
   *    @param {boolean} active(optional)  Booelan query parameter to indicate active/non-active customers.
   *    @param {object} businessUnit(required)  The business unit to retrieve a customer for.
   * }
   */
  async getCustomers(params = {}) {
    logger.info("NextologiesManager getCustomers");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnit === "undefined") {
      throw genericError({
        message: `Get Customers failed due to: businessUnit is missing.`,
        status: 400,
        code: 400
      });
    }
    let url = "?";
    let hasActive = false;
    if (typeof params.active !== "undefined") {
      url += `active=${params.active}`;
      hasActive = true;
    }
    if (
      typeof params.contact !== "undefined" &&
      (typeof params.contact.emailAddress !== "undefined" ||
        typeof params.origEmailAddress !== "undefined")
    ) {
      url += `${hasActive ? "&" : ""}search=${encodeURIComponent(
        params.origEmailAddress || params.contact.emailAddress
      )}`;
    }
    try {
      const options = {
        url: `/customers${url}`,
        method: "GET"
      };
      const customers = await nextologiesService.makeRequest(options);
      return customers;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `NextologiesManager getCustomers took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get a customer from Nextologies.
   *
   * @param {object} params
   * {
   *    @param {object} contactId(required)  The contact id.
   *    @param {object} businessUnit(required)  The business unit to retrieve a customer for.
   * }
   */
  async getCustomerById(params = {}) {
    logger.info("NextologiesManager getCustomerById");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.contactId === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message: `Get Customer By Id failed due to: One of required contactId, and/or businessUnit is missing.`,
        status: 400,
        code: 400
      });
    }
    try {
      const options = {
        url: `/customers/${params.contactId}`,
        method: "GET"
      };
      const customers = await nextologiesService.makeRequest(options);
      if (!customers.length) {
        throw genericError({
          message: `Get Customer By Id failed due to: customer (${params.contactId}) not found.`,
          status: 404,
          code: 404
        });
      }
      return customers;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `NextologiesManager getCustomerById took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Create a customer in Nextologies.
   *
   * @param {object} params
   * {
   *    @param {object} contact(required)  The contact object.
   *    @param {object} businessUnit(required)  The business unit to retrieve a customer for.
   * }
   */
  async createCustomer(params = {}) {
    logger.info("NextologiesManager createCustomer");
    const _timeStart = process.hrtime();
    if (
      !params ||
      typeof params.contact === "undefined" ||
      typeof params.contact.emailAddress === "undefined" ||
      typeof params.contact.fname === "undefined" ||
      typeof params.contact.lname === "undefined" ||
      typeof params.businessUnit === "undefined"
    ) {
      throw genericError({
        message: `Create customer failed due to: One of required contact, contact.emailAddress, contact.fname, contact.lname, and/or businessUnit is missing.`,
        status: 400,
        code: 400
      });
    }
    try {
      const contact = {
        email: params.contact.emailAddress,
        firstName: params.contact.fname,
        lastName: params.contact.lname
      };
      const options = {
        url: `/customers`,
        method: "POST",
        body: {
          contact,
          setup: {
            //TODO: temporary password generator
            password: Math.random()
              .toString()
              .slice(2, 25),
            active: true
          }
        }
      };
      const customer = nextologiesService.makeRequest(options);
      return customer;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `NextologiesManager createCustomer took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  },
  /**
   * Get packages from Nextologies.
   *
   * @param {object} params
   * {
   *    @param {object} businessUnit(required)  The business unit to retrieve a customer for.
   * }
   */
  async getPackages(params = {}) {
    logger.info("NextologiesManager getPackages");
    const _timeStart = process.hrtime();
    if (!params || typeof params.businessUnit === "undefined") {
      throw genericError({
        message: `Get packages failed due to: businessUnit is missing.`,
        status: 400,
        code: 400
      });
    }
    try {
      const options = {
        url: `/packages`,
        method: "GET"
      };
      const packages = nextologiesService.makeRequest(options);
      return packages;
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `NextologiesManager getPackages took ${(_timeEnd[0] * NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
