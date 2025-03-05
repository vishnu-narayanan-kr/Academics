"use strict";
const express = require("express");
const router = express.Router();
const { issueManager } = require("./../../managers");
const logger = require("./../../logger")(module);
const { validationError } = require("./../../utils/error");

/**
 * GET available issues
 * Request query strings parameters
 * @param {number} page(optional) Defaults to 1.
 * @param {number} pageLimit(optional) Defaults to 10.
 */
router.get("/", async (req, res, next) => {
  logger.info(`GET: get available issues`);
  try {
    const issues = await issueManager.getIssues({
      page: req.query.page,
      pageLimit: req.query.pageLimit
    });
    const data = {
      issues
    };
    return res.json(data);
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

/**
 * DELETE an available issue
 * Request parameter string
 * @param {string} id(required) The issue id to delete.
 */
router.delete("/:id", async (req, res, next) => {
  logger.info(`DELETE: delete issue ${req.params.id}`);
  try {
    await issueManager.deleteIssue({
      id: req.params.id
    });
    return res.json({});
  } catch (e) {
    logger.error(e);
    return next(e);
  }
});

module.exports = router;
