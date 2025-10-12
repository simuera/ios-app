import prisma from '../../lib/prisma';
export const findUserByEmail = (email: string) => prisma.user.findUnique({ where: { email } });
export const createUser = (data: { email: string; passwordHash: string; name?: string }) =>
  prisma.user.create({ data });
export const createSession = (data: { userId: string; userAgent?: string; ip?: string }) =>
  prisma.session.create({ data });
export const createAudit = (data: { action: string; userId?: string; meta?: any }) =>
  prisma.auditLog.create({ data });
