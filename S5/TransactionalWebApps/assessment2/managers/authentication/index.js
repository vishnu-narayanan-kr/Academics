"use strict";
const db = require("./../../database");
const debug = require("debug")("manager:authentication");
const debugTiming = require("debug")("timing");
const env = require("./../../config/env");
const logger = require("./../../logger")(module);
const bcrypt = require("bcrypt");
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const { NS_PER_SEC } = require("./../../utils/constants");

const generateError = code => {
  return genericError({
    message: "Authentication failed.",
    status: 401,
    code: 401,
    errors: [
      {
        code,
        message: ERROR_CODES[code]
      }
    ],
    type: "AuthError"
  });
};

//TODO:  use a cache for faster response
module.exports = {
  async checkAuthTokenMiddleware(req, res, next) {
    logger.info("AuthenticationManager checkAuthTokenMiddleware");
    const _timeStart = process.hrtime();
    let connection = null;
    try {
      if (
        req.headers &&
        (req.headers.authorization ||
          req.headers["iristelx-api-key"] ||
          req.headers["iristelx-system-key"])
      ) {
        let token;
        let secret;
        let apikey;
        let systemkey;
        let useSystemKey = false;
        let useApiKey = true;
        if (req.headers.authorization) {
          const parts = req.headers.authorization.split(" ");
          if (parts.length === 2) {
            const [scheme, authtoken] = parts;
            if (/^Bearer$/i.test(scheme)) {
              [token, secret] = authtoken.split(".");
            }
            if (token === undefined || secret === undefined) {
              // token missing
              return next(generateError(10025));
            }
            useApiKey = false;
          }
        } else {
          if (req.headers["iristelx-system-key"]) {
            systemkey = req.headers["iristelx-system-key"];
            const _headerSystemKey = await bcrypt.hash(
              systemkey,
              env.token_salt
            );
            if (_headerSystemKey.split(env.token_salt)[1] !== env.system_key) {
              return next(generateError(10026));
            }
            useSystemKey = true;
          } else {
            apikey = req.headers["iristelx-api-key"];
          }
        }
        try {
          connection = await db.getIristelXConnection();
          let query;
          let values = [];
          if (useSystemKey) {
            query = `SELECT *, b.config AS businessUnitConfig, a.config AS apiConfig FROM
          businessUnits AS b INNER JOIN apiAccounts AS a ON a.businessUnitId = b.businessUnitId
          WHERE a.enabled = 1 AND a.apiId = ?`;
            values = [req.headers["iristelx-api-id"]];
            logger.info(`Api Id: ${req.headers["iristelx-api-id"]}`);
          } else {
            if (useApiKey) {
              query = `SELECT *, b.config AS businessUnitConfig, a.config AS apiConfig FROM
          businessUnits AS b INNER JOIN apiAccounts AS a ON a.businessUnitId = b.businessUnitId
          WHERE a.enabled = 1 AND a.apikey = ?`;
              const _headerApiKey = await bcrypt.hash(apikey, env.token_salt);
              values = [_headerApiKey.split(env.token_salt)[1]];
              logger.info(`Api Key: ${_headerApiKey.split(env.token_salt)[1]}`);
            } else {
              query = `SELECT *, b.config AS businessUnitConfig, a.config AS apiConfig FROM
          businessUnits AS b INNER JOIN apiAccounts AS a ON a.businessUnitId = b.businessUnitId
          WHERE a.enabled = 1 AND a.token = ? AND a.secret = ?`;
              const _secret = await bcrypt.hash(secret, env.password_salt);
              values = [token, _secret.split(env.password_salt)[1]];
              logger.info(`Token: ${token}`);
            }
          }
          const apiAccount = await connection.query(query, values);
          if (apiAccount[0].length === 1) {
            req._businessUnit = apiAccount[0][0];
            req._businessUnit.config = JSON.parse(
              req._businessUnit.businessUnitConfig
            );
            req._businessUnit.apiConfig = JSON.parse(
              req._businessUnit.apiConfig
            );
            req.permissions = JSON.parse(req._businessUnit.permissions);
            delete req._businessUnit.token;
            delete req._businessUnit.secret;
            delete req._businessUnit.apikey;
            delete req._businessUnit.permissions;
            delete req._businessUnit.businessUnitConfig;
            return next();
          } else {
            return next(generateError(10027));
          }
        } catch (error) {
          logger.error(error);
          return next(generateError(10026));
        }
        // add something here to ensure the token is valid
      } else {
        // No authorization or x-api-key header => invalid credentials
        return next(generateError(10028));
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      connection && connection.release();
      const _timeEnd = process.hrtime(_timeStart);
      logger.debug(
        `AuthenticationManager checkAuthTokenMiddleware took ${(_timeEnd[0] *
          NS_PER_SEC +
          _timeEnd[1]) /
          NS_PER_SEC} seconds`,
        debugTiming
      );
    }
  }
};
