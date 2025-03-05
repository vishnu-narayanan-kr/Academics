"use strict";
const express = require("express");
const router = express.Router();
const logger = require("./../../logger")(module);
const ERROR_CODES = require("./../../error-codes");

/**
 * GET all error codes/messages
 *
 */
router.get("/", async (req, res, next) => {
  logger.info("GET:  error codes/messages");
  res.json(ERROR_CODES);
});

module.exports = router;
