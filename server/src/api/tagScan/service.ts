import * as repo from './repo';
import { Queue } from 'bullmq';
import { redis } from '../../lib/redis';
import { logger } from '../../lib/logger';
const queue = redis ? new Queue('tag-scan', { connection: redis as any }) : null;
export async function enqueueTagScan(code: string, payload?: any) {
  const existing = await repo.findByCode(code);
  if (existing) throw { statusCode: 409, message: 'Already exists' };
  const record = await repo.createTagScan({ code, payload });
  if (!queue) throw { statusCode: 503, message: 'Queue not available' };
  await queue.add('process', { tagScanId: record.id }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
  logger.info('TagScan queued', { tagScanId: record.id });
  return record;
}
