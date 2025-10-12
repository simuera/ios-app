import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { logger } from './logger';
const JWT_SECRET: Secret = (process.env.JWT_SECRET as Secret) || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';
export function signToken(payload: object) {
  const opts: SignOptions = { expiresIn: JWT_EXPIRES as any };
  return jwt.sign(payload as any, JWT_SECRET, opts);
}
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    logger.debug('JWT verify failed', { error: err });
    return null;
  }
}
