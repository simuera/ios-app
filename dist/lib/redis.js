"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisReady = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
// Redis client may be optional for local dev. Export `redis` as nullable
// and provide a `redisReady` promise that resolves when connection is established.
exports.redis = null;
let _resolveReady = () => { };
exports.redisReady = new Promise((resolve) => {
    _resolveReady = resolve;
});
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    logger_1.logger.warn('REDIS_URL not provided — continuing without Redis (degraded mode)');
    // resolve immediately so callers waiting can continue
    _resolveReady();
}
else {
    try {
        exports.redis = new ioredis_1.default(redisUrl, {
            // allow ioredis to retry; we also log and keep redis nullable if it cannot connect
            maxRetriesPerRequest: null,
            enableOfflineQueue: true,
        });
        exports.redis.on('connect', () => {
            logger_1.logger.info('Redis client connected');
            _resolveReady();
        });
        exports.redis.on('ready', () => logger_1.logger.info('Redis ready'));
        exports.redis.on('error', (err) => logger_1.logger.error('Redis client error', { error: err }));
        // if close happens, we keep redis reference but operations may fail until reconnection
        exports.redis.on('end', () => logger_1.logger.warn('Redis connection ended'));
    }
    catch (err) {
        logger_1.logger.error('Failed to initialize Redis client', { error: err });
        exports.redis = null;
        _resolveReady();
    }
}
