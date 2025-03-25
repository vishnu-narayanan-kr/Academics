"use strict";

const winston = require("winston");
const env = require("./config/env");
const httpContext = require("express-cls-hooked");

// Wrap Winston logger to print reqId in each log
const formatMessage = message => {
  const reqId = httpContext.get("reqId");
  //type, stack, message, errors
  let error = message;
  if (typeof message === "string") {
    error = {
      message: message
    };
  }
  return `Request ID: ${reqId} ${error.message || ""}\n${error.type || ""}\n${(
    error.errors || []
  ).reduce((acc, err) => {
    return acc + `code: ${err.code} message: ${err.message}\n`;
  }, "")}${error.stack || ""}`;
};

const level = env.log_level || "verbose";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  verbose: "cyan",
  debug: "blue",
  silly: "magenta"
};

winston.config.addColors(colors);

const getLabel = callingModule => {
  const parts = callingModule.filename.split("/");
  return parts[parts.length - 2] + "/" + parts.pop();
};

const logger = callingModule => {
  const winstonLogger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level,
        label: getLabel(callingModule),
        name: "log-console",
        colorize: process.stdout.isTTY,
        prettyPrint: true,
        silent: false,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        json: false,
        timestamp: () => new Date().toISOString()
        // formatter: options =>
        //   // - Return string will be passed to logger.
        //   // - Optionally, use options.colorize(options.level, <string>) to
        //   //   colorize output based on the log level.
        //   options.timestamp() +
        //   " " +
        //   winston.config.colorize(options.level, options.level.toUpperCase()) +
        //   " " +
        //   (options.message ? options.message : "") +
        //   (options.meta && Object.keys(options.meta).length ? "\n\t" + JSON.stringify(options.meta) : "")
      })
    ],
    levels
  });

  return {
    log: (level, message) => {
      winstonLogger.log(level, formatMessage(message));
    },
    error: message => {
      winstonLogger.error(formatMessage(message));
    },
    warn: message => {
      winstonLogger.warn(formatMessage(message));
    },
    verbose: message => {
      winstonLogger.verbose(formatMessage(message));
    },
    info: message => {
      winstonLogger.info(formatMessage(message));
    },
    debug: (message, debugFn) => {
      debugFn
        ? debugFn(formatMessage(message))
        : winstonLogger.debug(formatMessage(message));
    },
    silly: message => {
      winstonLogger.silly(formatMessage(message));
    }
  };
};
module.exports = logger;
