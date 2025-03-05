"use strict";

const env = require("./config/env");
const logger = require("./logger")(module);
const mysql = require("mysql2/promise");
// const sleep = require("./utils/sleep").sleep;
const connectionPoolIristelX = mysql.createPool(env.mysql);

// const connectionWritePool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB,
//   connectionLimit: (parseInt(process.env.CONNECTION_LIMIT) || 20),
//   multipleStatements: true
// });

// const connectionReadPool = mysql.createPool({
//   host: process.env.DB_HOST_READ,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB,
//   connectionLimit: (parseInt(process.env.CONNECTION_LIMIT) || 20),
//   multipleStatements: true
// });

module.exports = {
  async getIristelXConnection(read = false) {
    try {
      let connection = null;
      let retries = Math.abs(parseInt(process.env.DB_RETRIES) || 2);
      while (connection === null) {
        if (retries > 0) {
          connection = await connectionPoolIristelX.getConnection();
          // if (!read) {
          // connection = await connectionWritePool.getConnection();
          try {
            // await connection.ping();
            await connection.query("SELECT 1");
            // const [readonly, fields] = await connection.query("SHOW GLOBAL VARIABLES LIKE 'innodb_read_only'");
            // if (readonly[0].Value === "ON") {
            //   connection.destroy();
            //   connection = null;
            // }
          } catch (e) {
            logger.error(e);
            connection.destroy();
            connection = null;
            // await sleep(parseInt(process.env.DB_SLEEP) || 2000);
          }
        } else {
          throw new Error("Cannot establish connection to database.");
        }
        // } else {
        //   connection = await connectionReadPool.getConnection();
        //   try {
        //     await connection.ping();
        //   } catch (e) {
        //     connection.destroy();
        //     connection = null;
        //   }
        // }
        retries--;
      }
      return connection;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
