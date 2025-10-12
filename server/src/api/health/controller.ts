import { Router } from 'express';
import prisma from '../../lib/prisma';
import { success } from '../../utils/respond';
const router = Router();
router.get('/', async (req, res) => {
  // allow skipping DB health check in unit tests or lightweight runs
  if (!process.env.DATABASE_URL || process.env.SKIP_DB_HEALTH === 'true') {
    return success(res, { status: 'ok' });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return success(res, { status: 'ok' });
  } catch (e) {
    return res.status(503).json({ status: 'fail', error: 'db-unavailable' });
  }
});
export default router;
