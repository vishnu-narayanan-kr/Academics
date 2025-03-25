"use strict";

const ERROR_CODES = require("./../error-codes");

module.exports = {
    /**
     * Returns a validation error.
     * 
     * @param {object} config {
     *      @param {array} errors An array of errors.
     * }
     */
    validationError({
        errors = [],
        status = 400,
        code = 400
    }) {
        const error = new Error("Validation failed.");
        error.code = code;
        error.status = status;
        error.errors = errors;
        error.type = "ValidationError";
        return error;
    },

    /**
     * Returns a generic error.
     * @param {object} config {
     *      @param {string} message The error message.
     *      @param {number} status The http status to return.
     *      @param {number} code The error code.
     *      @param {string} type The type of error.
     *      @param {array} errors An array of errors.
     * }
     */
    genericError({
        message = "",
        status = 500,
        code = 500,
        type = "GenericError",
        errors = []
    }) {
        if(!message) {
            message = ERROR_CODES[code] || "An application error occurred.";
        }
        const error = new Error(message);
        error.code = code;
        error.status = status;
        error.errors = errors;
        error.type = type;
        return error;
    }
};