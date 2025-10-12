import { Worker, Job } from 'bullmq';
import { redis, redisReady } from './lib/redis';
import prisma from './lib/prisma';
import { logger } from './lib/logger';

let workerInstance: Worker | null = null;

export async function startWorker() {
  await redisReady;
  if (!redis) {
    logger.warn('Redis not available — worker will not start');
    return;
  }

  workerInstance = new Worker(
    'tag-scan',
    async (job: Job) => {
      logger.info('Processing job', { jobId: job.id, data: job.data });
      const { tagScanId } = job.data;
      await prisma.tagScan.update({ where: { id: tagScanId }, data: { status: 'processing' } });
      await new Promise((r) => setTimeout(r, 500));
      await prisma.tagScan.update({ where: { id: tagScanId }, data: { status: 'done' } });
      logger.info('Job done', { tagScanId });
    },
    { connection: redis as any }
  );

  workerInstance.on('failed', (job, err) => logger.error('Job failed', { jobId: job?.id, error: err }));
  workerInstance.on('completed', (job) => logger.info('Job completed', { jobId: job.id }));
  logger.info('Worker started');
}

export async function stopWorker() {
  if (workerInstance) {
    try {
      await workerInstance.close();
      logger.info('Worker stopped');
    } catch (err) {
      logger.warn('Error stopping worker', { error: err });
    }
    workerInstance = null;
  }
}
