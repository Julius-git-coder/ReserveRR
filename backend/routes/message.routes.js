const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRole } = require('../middlewares/roles');
const {
  getTeamMessages,
  getDirectMessages,
  sendMessage,
  broadcastMessage,
} = require('../controllers/message.controller');

router.get('/team/:teamId', auth, getTeamMessages);
router.get('/user/:userId', auth, getDirectMessages);
router.post('/', auth, sendMessage);
router.post('/admins/message/broadcast', auth, requireRole('admin'), broadcastMessage);

module.exports = router;

