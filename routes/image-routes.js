import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth-middleware.js';
import adminMiddleware  from '../middlewares/adminMiddleware.js';
import { uploadImageMiddleware } from '../middlewares/upload-middleware.js';

import  { uploadImageController, getAllImagesConttroller, deleteImageController }  from '../controllers/image-controller.js'


const router =  Router();


router.post('/upload', authMiddleware, adminMiddleware, uploadImageMiddleware, uploadImageController);
router.get('/get', authMiddleware, getAllImagesConttroller)

router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController)

export default router;