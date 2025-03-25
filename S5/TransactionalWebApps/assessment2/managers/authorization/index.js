/*
  Credit: https://github.com/nyambati/express-acl
*/
"use strict";

const debug = require("debug")("manager:authorization");
const debugTiming = require("debug")("timing");
const logger = require("./../../logger")(module);
const { genericError } = require("./../../utils/error");
const unless = require("express-unless");
const {
  findPermissionForRoute,
  checkIfHasAccess,
  deny
} = require("./../../utils/middleware/authorization/common");

const { NS_PER_SEC } = require("./../../utils/constants");

let options = {
  policies: new Map()
};

let responseObject = {
  message: "You are not authorized to access this resource."
};

/**
 * [authorize Express middleware]
 * @param  {[type]}   req  [Th request object]
 * @param  {[type]}   res  [The response object]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */

function authorize(req, res, next) {
  logger.info("AuthorizationManager authorize");
  const _timeStart = process.hrtime();
  try {
    if (req.originalUrl === "/") {
      return next();
    }

    const policy = req.permissions.rules;

    if (!policy) {
      return res.status(403).json({
        message: `REQUIRED: Policy is not defined`
      });
    }

    const permission = findPermissionForRoute(
      req.originalUrl,
      req.method,
      options.baseUrl,
      policy
    );

    if (!permission) {
      if (typeof options.denyCallback === "function") {
        return options.denyCallback(res);
      }
      return res.status(403).json(deny(options.customMessage, responseObject));
    }

    return checkIfHasAccess(
      req.method,
      res,
      next,
      permission,
      options.customMessage,
      options.response,
      options.denyCallback
    );
  } catch (e) {
    logger.error(e);
    return next(
      genericError({
        message: "You are not authorized to access this resource.",
        status: 403,
        code: 403,
        type: "AuthError"
      })
    );
  } finally {
    const _timeEnd = process.hrtime(_timeStart);
    logger.debug(
      `AuthorizationManager authorize took ${(_timeEnd[0] * NS_PER_SEC +
        _timeEnd[1]) /
        NS_PER_SEC} seconds`,
      debugTiming
    );
  }
}

authorize.unless = unless;

module.exports = {
  authorize
};
