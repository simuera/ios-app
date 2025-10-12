"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceTagJob = produceTagJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("../lib/redis");
let tagQueue = null;
if (redis_1.redis) {
    tagQueue = new bullmq_1.Queue('tag-scan', { connection: redis_1.redis });
}
async function produceTagJob(payload) {
    if (!tagQueue) {
        throw new Error('Job queue not available (Redis not connected)');
    }
    await tagQueue.add('process', payload, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } });
}
