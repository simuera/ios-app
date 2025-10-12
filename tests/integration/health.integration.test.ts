import request from 'supertest';
import app from '../../server/src/app';

describe('Integration GET /api/health', () => {
  const runIntegration = process.env.RUN_INTEGRATION === 'true';
  const testFn = runIntegration ? it : it.skip;

  testFn('returns 200 when DB is available', async () => {
    // ensure the test runner sets DATABASE_URL to a real containerized postgres
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for integration test');
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
