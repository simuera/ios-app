import { Router } from 'express';
import * as service from './service';
import { success, fail } from '../../utils/respond';
const router = Router();
router.post('/register', async (req, res) => {
  try {
    const out = await service.registerUser(req.body);
    return success(res, out, 201);
  } catch (err: any) {
    return fail(res, { message: err.message || 'error' }, err.statusCode || 500);
  }
});
router.post('/login', async (req, res) => {
  try {
    const out = await service.loginUser({ ...req.body, userAgent: req.headers['user-agent'], ip: req.ip });
    return success(res, out);
  } catch (err: any) {
    return fail(res, { message: err.message || 'error' }, err.statusCode || 500);
  }
});
export default router;
