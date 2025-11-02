import express from 'express';
import auth from '../middlewares/auth.js';
import { uploadMiddleware, uploadFile } from '../controllers/upload.controller.js';

const router = express.Router();

// Handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB' });
    }
    if (err.message === 'Only images and documents are allowed') {
      return res.status(400).json({ message: err.message });
    }
    console.error('Multer error:', err);
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  next();
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/', auth, uploadMiddleware, handleMulterError, asyncHandler(uploadFile));

export default router;

