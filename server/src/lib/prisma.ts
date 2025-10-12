import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'info', 'warn', 'error']
});
;(prisma as any).$on('error', (e: unknown) => logger.error('Prisma error', { error: e }));
export default prisma;
