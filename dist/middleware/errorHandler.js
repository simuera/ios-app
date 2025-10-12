"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../lib/logger");
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const error = err;
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    logger_1.logger.error(message, { statusCode, stack: error.stack, requestId: req.id });
    const payload = { status: statusCode >= 500 ? 'error' : 'fail', message };
    if (process.env.NODE_ENV !== 'production')
        payload.stack = error.stack;
    if (error.details)
        payload.details = error.details;
    res.status(statusCode).json(payload);
};
exports.errorHandler = errorHandler;
exports.default = errorHandler;
