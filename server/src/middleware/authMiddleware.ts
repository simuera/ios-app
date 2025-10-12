import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import { logger } from '../lib/logger';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    logger.warn('Invalid token', { requestId: req.id });
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = { sub: decoded.sub ?? decoded.id, email: decoded.email, role: decoded.role };
  next();
};
