import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import * as repo from './repo';
import { success, fail } from '../../utils/respond';
const router = Router();
router.get('/', authMiddleware, async (req, res) => {
  try {
    const data = await repo.listUsers();
    return success(res, data);
  } catch (err: any) {
    return fail(res, err, 500);
  }
});
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (!req.user) return fail(res, { message: 'Unauthorized' }, 401);
    const user = await repo.findById(req.user.sub);
    return success(res, user);
  } catch (err: any) {
    return fail(res, err, 500);
  }
});
export default router;
