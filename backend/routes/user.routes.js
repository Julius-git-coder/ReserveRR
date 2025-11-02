const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const { getMe, getTeamMembers, getAdminStats, getAdminByTeamId } = require('../controllers/user.controller');

router.get('/me', auth, getMe);
router.get('/team/members', auth, getTeamMembers); // Available for both admin and students
router.get('/admins/me/stats', auth, requireRole('admin'), getAdminStats);
router.get('/admins/team/:teamId', getAdminByTeamId); // Public endpoint for signup

module.exports = router;

