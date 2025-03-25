"use strict";

module.exports = {
  // Broadsoft
  broadsoft: {
    wsdl_url: process.env.BROADSOFT_WSDL_URL
  },

  encryption_key: process.env.ENCRYPTION_KEY,

  // Espresso
  espresso_did: {
    wsdl_url: process.env.ESPRESSO_DID_WSDL_URL
  },

  //Huawei
  huawei: {
    api_key: process.env.HUAWEI_API_KEY,
    base_url: process.env.HUAWEI_BASE_URL
  },

  // IPSwitch
  ipswitch: {
    wsdl_url: process.env.IPSWITCH_WSDL_URL
  },

  // Logentries Token
  // logentries: {
  //   token: process.env.LOGENTRIES_TOKEN
  // },

  log_level: process.env.LOG_LEVEL || "info",

  // MIND Bill/PMG
  mind: {
    bill: {
      wsdl_url: process.env.MIND_WSDL_URL
    },
    pmg: {
      wsdl_url: process.env.MIND_PMG_WSDL_URL
    }
  },

  // Nextologies
  nextologies: {
    api_key: process.env.NEXTOLOGIES_API_KEY,
    base_url: process.env.NEXTOLOGIES_BASE_URL
  },

  // // JSON Web Token
  // jwt: {
  //     // secret: process.env.JWT_SECRET,
  //     secret: process.env.JWT_SECRET,
  //     expire: parseInt(process.env.JWT_EXPIRE) || 86400, //default is one day
  //     refreshExpire: parseInt(process.env.JWT_REFRESH_EXPIRE) || 2592000, //default is 30 days,
  //     refreshTokenSecret: process.env.JWT_REFRESH_SECRET
  // },

  // Connection String to the DB MySQL instance on Heroku
  mysql: process.env.DB_URL,

  // Connection String to the ERRORS DB MySQL instance
  errors_mysql: process.env.ERRORS_DB_URL,

  node_environment: process.env.NODE_ENV || "local",

  password_salt: process.env.PASSWORD_SALT,

  //QuotaGuard Static IP
  quota_guard: {
    proxy: process.env.QUOTAGUARDSTATIC_URL
  },

  system_key: process.env.IRISTELX_SYSTEM_KEY,

  token_salt: process.env.TOKEN_SALT
};