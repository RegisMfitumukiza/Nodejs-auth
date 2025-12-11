import { Router } from 'express';
import { registerUser, loginUser, changePassword } from '../controllers/auth-controller.js';

import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', authMiddleware, changePassword);





export default router;