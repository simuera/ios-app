import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import * as service from './service';
import { success, fail } from '../../utils/respond';
const router = Router();
router.post('/', authMiddleware, async (req, res) => {
  try {
    const out = await service.enqueueTagScan(req.body.code, req.body.payload);
    return success(res, out, 201);
  } catch (err: any) {
    return fail(res, { message: err.message || 'error' }, err.statusCode || 500);
  }
});
export default router;
