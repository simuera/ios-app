"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueTagScan = enqueueTagScan;
const repo = __importStar(require("./repo"));
const bullmq_1 = require("bullmq");
const redis_1 = require("../../lib/redis");
const logger_1 = require("../../lib/logger");
const queue = redis_1.redis ? new bullmq_1.Queue('tag-scan', { connection: redis_1.redis }) : null;
async function enqueueTagScan(code, payload) {
    const existing = await repo.findByCode(code);
    if (existing)
        throw { statusCode: 409, message: 'Already exists' };
    const record = await repo.createTagScan({ code, payload });
    if (!queue)
        throw { statusCode: 503, message: 'Queue not available' };
    await queue.add('process', { tagScanId: record.id }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
    logger_1.logger.info('TagScan queued', { tagScanId: record.id });
    return record;
}
