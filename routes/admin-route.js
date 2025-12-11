import { Router } from 'express'

import { authMiddleware } from '../middlewares/auth-middleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = Router();


router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {

    const {userId, email, username, role } = req.userInfo;

    res.status(200).json({
        message: 'Welcome to Admin Page',
        user: {
            _id: userId,
            email,
            username,
            role
        }
    })
})

export default router