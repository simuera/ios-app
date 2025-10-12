import prisma from '../../lib/prisma';
export const findById = (id: string) => prisma.user.findUnique({ where: { id } });
export const listUsers = (skip = 0, take = 50) => prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
