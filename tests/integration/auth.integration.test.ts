import request from 'supertest';
import app from '../../server/src/app';
import { registerUser, loginUser } from './helpers';

const TEST_EMAIL = 'it@example.com';
const TEST_PW = 'password123';

describe('Auth integration', () => {
  const runIntegration = process.env.RUN_INTEGRATION === 'true';
  const testFn = runIntegration ? it : it.skip;

  testFn('register -> login -> me', async () => {
    await registerUser({ email: TEST_EMAIL, password: TEST_PW });
  const login = await loginUser({ email: TEST_EMAIL, password: TEST_PW });
  // service returns { token, user }
  expect(login).toHaveProperty('token');

  const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${login.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('email', TEST_EMAIL);
  });
});
