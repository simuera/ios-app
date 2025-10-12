import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/jwt';
import * as repo from './repo';
import { logger } from '../../lib/logger';
export async function registerUser(payload: { email: string; password: string; name?: string }) {
  const existing = await repo.findUserByEmail(payload.email);
  if (existing) throw { statusCode: 409, message: 'Email already in use' };
  const hash = await bcrypt.hash(payload.password, 12);
  const user = await repo.createUser({ email: payload.email, passwordHash: hash, name: payload.name });
  logger.info('User registered', { userId: user.id });
  await repo.createAudit({ action: 'user.register', userId: user.id });
  return { id: user.id, email: user.email, name: user.name };
}
export async function loginUser(payload: { email: string; password: string; userAgent?: string; ip?: string }) {
  const user = await repo.findUserByEmail(payload.email);
  if (!user) throw { statusCode: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(payload.password, user.passwordHash);
  if (!ok) throw { statusCode: 401, message: 'Invalid credentials' };
  await repo.createSession({ userId: user.id, userAgent: payload.userAgent, ip: payload.ip });
  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  await repo.createAudit({ action: 'user.login', userId: user.id });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}
