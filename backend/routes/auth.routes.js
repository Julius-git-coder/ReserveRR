import express from 'express';
import { adminSignup, studentSignup, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/admin/signup', adminSignup);
router.post('/student/signup', studentSignup);
router.post('/login', login);

export default router;

