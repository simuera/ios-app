import 'dotenv/config';
import app from './app';
import { logger } from './lib/logger';
import './lib/tracing';
import prisma from './lib/prisma';
import { startWorker } from './worker';

const port = Number(process.env.PORT || 3000);

async function connectWithRetry(maxAttempts = 8) {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      await prisma.$connect();
      logger.info('Prisma connected');
      return;
    } catch (err) {
      attempt += 1;
      const wait = Math.min(30000, 2 ** attempt * 1000);
      logger.warn('Prisma connection failed, retrying', { attempt, wait, error: err });
      await new Promise((res) => setTimeout(res, wait));
    }
  }
  throw new Error('Unable to connect to Prisma after retries');
}

async function start() {
  try {
    await connectWithRetry();
    app.listen(port, () => logger.info(`Server listening on ${port}`));
    // start background worker in production mode
    if (process.env.NODE_ENV === 'production') {
      startWorker().catch((err) => logger.error('Worker failed to start', { error: err }));
    }
  } catch (err) {
    logger.error('Failed to start after retries', { error: err });
    process.exit(1);
  }
}

start();
