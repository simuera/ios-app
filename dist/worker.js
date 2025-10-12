"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("./lib/redis");
const prisma_1 = __importDefault(require("./lib/prisma"));
const logger_1 = require("./lib/logger");
async function startWorker() {
    await redis_1.redisReady;
    if (!redis_1.redis) {
        logger_1.logger.warn('Redis not available — worker will not start');
        return;
    }
    const worker = new bullmq_1.Worker('tag-scan', async (job) => {
        logger_1.logger.info('Processing job', { jobId: job.id, data: job.data });
        const { tagScanId } = job.data;
        await prisma_1.default.tagScan.update({ where: { id: tagScanId }, data: { status: 'processing' } });
        await new Promise((r) => setTimeout(r, 500));
        await prisma_1.default.tagScan.update({ where: { id: tagScanId }, data: { status: 'done' } });
        logger_1.logger.info('Job done', { tagScanId });
    }, { connection: redis_1.redis });
    worker.on('failed', (job, err) => logger_1.logger.error('Job failed', { jobId: job?.id, error: err }));
    worker.on('completed', (job) => logger_1.logger.info('Job completed', { jobId: job.id }));
    logger_1.logger.info('Worker started');
}
startWorker().catch((err) => logger_1.logger.error('Worker failed to start', { error: err }));
