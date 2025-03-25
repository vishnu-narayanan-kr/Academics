"use strict";

const env = require("./config/env");
const logger = require("./logger")(module);
const mysql = require("mysql2/promise");

const connectionPool = mysql.createPool(env.errors_mysql);

module.exports = {
  async getConnection(read = false) {
    try {
      let connection = null;
      let retries = Math.abs(parseInt(process.env.DB_RETRIES) || 2);
      while (connection === null) {
        if (retries > 0) {
          connection = await connectionPool.getConnection();

          try {
            await connection.query("SELECT 1");
          } catch (e) {
            logger.error(e);
            connection.destroy();
            connection = null;
          }
        } else {
          throw new Error("Cannot establish connection to error database.");
        }
        retries--;
      }
      return connection;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
