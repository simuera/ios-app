import prisma from '../server/src/lib/prisma';

beforeAll(async () => {
  if (process.env.RUN_INTEGRATION !== 'true') return;
  // ensure the database is reachable
  await prisma.$connect();
});

beforeEach(async () => {
  if (process.env.RUN_INTEGRATION !== 'true') return;
  // truncate known tables
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "TagScan", "AuditLog", "Session", "User" RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
  } catch (e) {
    // ignore
  }
});

// attempt to close Redis client after tests to avoid open handles
afterAll(async () => {
  try {
    // dynamic import to avoid module-level side-effects during test runtime
    const redisModule = await import('../server/src/lib/redis');
    const maybeRedis = redisModule?.redis;
    if (maybeRedis) {
      // prefer graceful quit if available
      if (typeof maybeRedis.quit === 'function') {
        try {
          await maybeRedis.quit();
        } catch (e) {
          try {
            maybeRedis.disconnect();
          } catch (_) {
            // ignore
          }
        }
      } else if (typeof maybeRedis.disconnect === 'function') {
        try {
          maybeRedis.disconnect();
        } catch (_) {
          // ignore
        }
      }
    }
  } catch (e) {
    // ignore
  }
});
