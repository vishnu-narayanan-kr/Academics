"use strict";

const ACCOUNT_STATUSES = {
  0: "NEW",
  1: "ACTIVE",
  2: "SUSPENDED",
  3: "CLOSED",
  4: "PERMANENT_CLOSED",
  5: "OLD",
  6: "ARCHIVED"
};

const DAYS = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday"
};

const DEPOSIT_STATUSES = {
  O: "OPEN",
  P: "PAIN",
  R: "RETURNED",
  D: "DELETED"
};

const INVOICE_STATUSES = {
  "0": "OPEN",
  "2": "CLOSED"
};

const LANGUAGES = {
  EN: "English",
  en: "English",
  FR: "French",
  fr: "French",
  RO: "Romanian",
  ro: "Romanian"
};

const NS_PER_SEC = 1e9;

const PACKAGE_STATUSES = {
  1: "ACTIVE",
  2: "SUSPENDED",
  3: "CLOSED"
};

const PORTING_STATUSES = [
  "Pending",
  "Processed",
  "Rejected. Pending Update",
  "Confirmed",
  "Updated",
  "Closed",
  "Canceled",
  "Pending Cancellation"
];

/*
Unit_Code	  Description	  Quantity of measure	  Type of Data where it is used
------------------------------------------------------------------------------                                                
1	          Minutes	      Seconds	              MOBILEINC
                                                MOBILEOUT
                                                RMOBILEINC
                                                RMOBILEOUT
                                                VOIP
                                                FAX
------------------------------------------------------------------------------                                                
2	          Messages	    Number	              SMSINC
                                                SMSOUT
                                                RSMSINC
                                                RSMSOUT
                                                FAX
------------------------------------------------------------------------------
3	           Money	      Number ($)	          ALL
------------------------------------------------------------------------------
13	         Data	        KB	                  ASDL
                                                GPRS
                                                RGPRS
*/
const USAGE_UNITS = {
  "-1": "", //just a number representing amount of messages
  1: "seconds",
  2: "", //just a number representing amount of messages
  3: "$",
  13: "KB"
};

module.exports = {
  ACCOUNT_STATUSES,
  DAYS,
  DEPOSIT_STATUSES,
  INVOICE_STATUSES,
  LANGUAGES,
  NS_PER_SEC,
  PACKAGE_STATUSES,
  PORTING_STATUSES,
  USAGE_UNITS
};
