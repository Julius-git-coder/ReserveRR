import express from 'express';
import auth from '../middlewares/auth.js';
import { uploadMiddleware, uploadFile } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/', auth, uploadMiddleware, uploadFile);

export default router;

