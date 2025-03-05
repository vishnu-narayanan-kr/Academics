"use strict";

const express = require("express");

const router = (module.exports = express.Router());

router.use("/accounts", require("./accounts"));
router.use("/billing", require("./billing"));
router.use("/plans", require("./plans"));
router.use("/porting", require("./porting"));
router.use("/telephone-numbers", require("./telephone-numbers"));
router.use("/sim-cards", require("./sim-cards"));
router.use("/webhooks", require("./webhooks"));
router.use("/errors", require("./errors"));
router.use("/issues", require("./issues"));