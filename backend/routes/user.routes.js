import express from 'express';
import auth from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';
import { getMe, getTeamMembers, getAdminStats, getAdminByTeamId, updateProfile, deleteStudent, updateStudentStatus } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateProfile); // Update current user's profile
router.get('/team/members', auth, getTeamMembers); // Available for both admin and students
router.get('/admins/me/stats', auth, requireRole('admin'), getAdminStats);
router.get('/admins/team/:teamId', getAdminByTeamId); // Public endpoint for signup

// Admin student management endpoints
router.delete('/admins/students/:studentId', auth, requireRole('admin'), deleteStudent);
router.put('/admins/students/:studentId/status', auth, requireRole('admin'), updateStudentStatus);

export default router;

