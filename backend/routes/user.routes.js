const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const { getMe, getTeamMembers, getAdminStats } = require('../controllers/user.controller');

router.get('/me', auth, getMe);
router.get('/admins/:teamId/members', auth, requireRole('admin'), getTeamMembers);
router.get('/admins/me/stats', auth, requireRole('admin'), getAdminStats);

module.exports = router;

