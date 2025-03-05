"use strict";

const broadSoftService = require("./broadsoft");
const espressoService = require("./espresso_did");
const huaweiService = require("./huawei");
const ipSwitchService = require("./ipswitch");
const mindBillService = require("./mindbill");
const nextologiesService = require("./nextologies");
const pmgService = require("./pmg");
const webHookService = require("./webhook");

module.exports = {
  broadSoftService,
  espressoService,
  huaweiService,
  ipSwitchService,
  mindBillService,
  nextologiesService,
  pmgService,
  webHookService
};
