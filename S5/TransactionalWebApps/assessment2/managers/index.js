"use strict";

const accountManager = require("./account");
const authenticationManager = require("./authentication");
const authorizationManager = require("./authorization");
const billingManager = require("./billing");
const broadSoftManager = require("./broadsoft");
const creditCardManager = require("./credit-card");
const huaweiManager = require("./huawei");
const ipSwitchManager = require("./ipswitch");
const nextologiesManager = require("./nextologies");
const planManager = require("./plan");
const portingManager = require("./porting");
const simCardManager = require("./sim-card");
const telephoneNumberManager = require("./telephone-number");
const webhookManager = require("./webhook");
const issueManager = require("./issues");
module.exports = {
  accountManager,
  authenticationManager,
  authorizationManager,
  billingManager,
  broadSoftManager,
  creditCardManager,
  huaweiManager,
  ipSwitchManager,
  nextologiesManager,
  planManager,
  portingManager,
  simCardManager,
  telephoneNumberManager,
  webhookManager,
  issueManager
};
