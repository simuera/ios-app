import request from 'supertest';
import app from '../../server/src/app';

export async function registerUser(user: { email: string; password: string }) {
  const res = await request(app).post('/api/auth/register').send(user);
  return res.body.data;
}

export async function loginUser(user: { email: string; password: string }) {
  const res = await request(app).post('/api/auth/login').send(user);
  return res.body.data;
}
