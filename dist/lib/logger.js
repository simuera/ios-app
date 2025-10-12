"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize, json } = winston_1.default.format;
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
    const metaJson = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}] ${message} ${metaJson}`;
});
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp(), json()),
    transports: []
});
exports.logger = logger;
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({ format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), consoleFormat) }));
}
else {
    logger.add(new winston_1.default.transports.Console({ format: combine(timestamp(), json()) }));
}
exports.default = logger;
