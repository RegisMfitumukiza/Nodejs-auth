import { Router } from 'express';
import  { authMiddleware } from '../middlewares/auth-middleware.js';


const router = Router();

router.get('/welcome', authMiddleware, (req, res) => {

    const {userId, email, username, role } = req.userInfo;
    
    res.json({
        message: "welcome to the home page",
        user: {
            _id: userId,
            username,
            email,
            role
        }
    });
});

export default router