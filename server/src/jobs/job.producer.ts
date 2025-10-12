import { Queue } from 'bullmq';
import { redis } from '../lib/redis';

let tagQueue: Queue | null = null;
if (redis) {
  tagQueue = new Queue('tag-scan', { connection: redis as any });
}

export async function produceTagJob(payload: any) {
  if (!tagQueue) {
    throw new Error('Job queue not available (Redis not connected)');
  }
  await tagQueue.add('process', payload, { attempts: 5, backoff: { type: 'exponential', delay: 1000 } });
}
