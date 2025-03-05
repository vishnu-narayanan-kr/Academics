"use strict";

// Hack Fix for MaxListenersExceededWarning: Possible EventEmitter memory leak detected. XXX error listeners added.
// change to 0 to remove limit
require("events").EventEmitter.defaultMaxListeners = 0;

// const env = require("./config/env");
const logger = require("./logger")(module);

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const compress = require("compression");
const uuidv4 = require("uuid/v4");
const httpContext = require("express-cls-hooked");
const { authenticationManager, authorizationManager } = require("./managers");
const routes = require("./routes/index");
const { genericError } = require("./utils/error");
const ERROR_CODES = require("./error-codes");

const app = express();
app.disable("x-powered-by");

process.on("warning", e => logger.warn(e.stack));
process
  .on("unhandledRejection", (reason, p) => {
    logger.warn(`Unhandled Rejection at: Promise ${p} reason: ${reason}`);
    process.exit(1);
  })
  .on("uncaughtException", err => {
    logger.error(`${err} Uncaught Exception thrown`);
    process.exit(1);
  });
app.use(cors());
app.use(compress());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/_healthcheck", (req, res) => {
  // logger.info(`_healthcheck call from IP: ${req.ip}`);
  return res.status(200).json({});
});

app.use(httpContext.middleware);
const trimmer = (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body).replace(/"\s+|\s+"/g, '"'));
  req.query = JSON.parse(JSON.stringify(req.query).replace(/"\s+|\s+"/g, '"'));
  next();
};
app.use(trimmer);
app.use(
  expressValidator(require("./utils/validators/express-validator-options"))
);
app.use(cookieParser());
app.use((req, res, next) => {
  httpContext.set("reqId", uuidv4());
  logger.info(`IP: ${req.ip}`);
  logger.info(`Headers: ${Object.keys(req.headers || {}).toString()}`);
  next();
});

app.use("*", authenticationManager.checkAuthTokenMiddleware);
app.use((req, res, next) => {
  if (!req.permissions.rules) {
    const err = genericError({
      status: 403,
      code: 403,
      message: "You have not set any rules. All traffic will be denied."
    });
    next(err);
  }
  next();
});

const aclOptions = {};
if (process.env.OPEN_ROUTES) {
  aclOptions.path = process.env.OPEN_ROUTES.split(",").map(path => path.trim());
}
app.use(authorizationManager.authorize.unless(aclOptions));

app.use("/", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = genericError({
    status: 404,
    code: 404,
    errors: [
      {
        code: 404,
        message: ERROR_CODES[404]
      }
    ]
  });
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  logger.error(err);
  err.status = err.status || 500;
  res.status(err.status).json({
    message: err.message,
    code: err.code || err.status,
    type: err.type || "GenericError",
    errors: err.errors || []
  });
});

module.exports = app;
