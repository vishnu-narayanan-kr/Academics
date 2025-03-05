"use strict";

const debugTiming = require("debug")("timing");
const db = require("../../errors-database");
const logger = require("./../../logger")(module);
const { genericError } = require("./../../utils/error");
const ERROR_CODES = require("./../../error-codes");
const { NS_PER_SEC } = require("./../../utils/constants");

module.exports = {
    /**
     * Get issues.
     *
     * @param {object} params
     * {
     *    @param {number} page(optional) Defaults to 1.
     *    @param {number} pageLimit(optional) Defaults to 10.
     * }
     */
    async getIssues(params = {}) {
        logger.info("IssueManager getIssues");
        const _timeStart = process.hrtime();

        let connection;
        try {
            connection = await db.getConnection();

            const countQuery = 'SELECT COUNT(*) as count FROM error_logs'
            const countResult = await connection.query(countQuery);
            const count = countResult[0][0].count;

            const query = 'SELECT * FROM error_logs LIMIT ? OFFSET ?';
            const page = parseInt(params.page || 1);
            const pageLimit = parseInt(params.pageLimit || process.env.PAGE_LIMIT);
            const values = [pageLimit, (page - 1) * pageLimit];

            const result = await connection.query(query, values);

            const errors = result[0].map(e => {
                return {
                    id: e.id,
                    error: e.payload_json
                }
            });
            return {
                total: count,
                totalPages: Math.ceil(count / pageLimit) || 0,
                pageLimit,
                page,
                errors: errors
            };

        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            connection && connection.release();
            const _timeEnd = process.hrtime(_timeStart);
            logger.debug(
                `IssueManager getIssues took ${(_timeEnd[0] * NS_PER_SEC + _timeEnd[1]) /
                NS_PER_SEC} seconds`,
                debugTiming
            );
        }
    },

    /**
    * Delete issues.
    *
    * @param {object} params
    * {
    *    @param {number} id(required) The issue id to delete.
    * }
    */
    async deleteIssue(params = {}) {
        logger.info("IssueManager deleteIssue");
        const _timeStart = process.hrtime();

        let connection;
        try {
            connection = await db.getConnection();

            const query = 'DELETE FROM error_logs WHERE id = ?'
            const values = [params.id];

            const result = await connection.query(query, values);

            if (result[0].affectedRows === 0) {
                throw genericError({
                    status: 404,
                    code: 404,
                    errors: [
                        {
                            code: 10039,
                            message: ERROR_CODES[10039]
                        }
                    ]
                });
            }
        } catch (e) {
            logger.error(e);
            throw e;
        } finally {
            connection && connection.release();
            const _timeEnd = process.hrtime(_timeStart);
            logger.debug(
                `IssueManager deleteIssue took ${(_timeEnd[0] * NS_PER_SEC + _timeEnd[1]) /
                NS_PER_SEC} seconds`,
                debugTiming
            );
        }
    }

};



