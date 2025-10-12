import request from 'supertest';
import prisma from '../../server/src/lib/prisma';
import app from '../../server/src/app';

const runIntegration = process.env.RUN_INTEGRATION === 'true';
const testFn = runIntegration ? it : it.skip;

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

testFn('enqueue tagScan and worker processes it', async () => {
  // create user and login
  const email = `queue_${Date.now()}@example.com`;
  const pw = 'password123';

  // start a worker in-process so jobs are processed during the test
  let stopWorker: (() => Promise<void>) | null = null;
  try {
    if (process.env.RUN_INTEGRATION === 'true') {
      const wk = await import('../../server/src/worker');
      if (wk && typeof wk.startWorker === 'function') {
        await wk.startWorker();
        stopWorker = async () => {
          if (typeof wk.stopWorker === 'function') await wk.stopWorker();
        };
      }
    }
  } catch (e) {
    // continue; worker is optional
  }

  await request(app).post('/api/auth/register').send({ email, password: pw });
  const loginRes = await request(app).post('/api/auth/login').send({ email, password: pw });
  // service returns { token, user } inside data
  const token = loginRes.body?.data?.token;
  expect(token).toBeDefined();

  // enqueue tagScan
  const code = `code-${Date.now()}`;
  const enqueueRes = await request(app)
    .post('/api/tag-scans')
    .set('Authorization', `Bearer ${token}`)
    .send({ code, payload: { some: 'data' } });
  expect(enqueueRes.status).toBe(201);
  const record = enqueueRes.body.data;

  // poll DB for status change from 'pending' -> 'done'
  const maxMs = 30000;
  const interval = 1000;
  let elapsed = 0;
  let found = null as any;
  while (elapsed < maxMs) {
    found = await prisma.tagScan.findUnique({ where: { id: record.id } });
    if (found && found.status === 'done') break;
    await sleep(interval);
    elapsed += interval;
  }

  expect(found).not.toBeNull();
  expect(found?.status).toBe('done');
  if (stopWorker) await stopWorker();
});
