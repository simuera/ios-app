import prisma from '../../lib/prisma';
export const createTagScan = (data: { code: string; payload?: any }) =>
  prisma.tagScan.create({ data: { code: data.code, payload: data.payload } });
export const updateStatus = (id: string, status: string) =>
  prisma.tagScan.update({ where: { id }, data: { status } });
export const findByCode = (code: string) => prisma.tagScan.findUnique({ where: { code } });
