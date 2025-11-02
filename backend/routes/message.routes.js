import express from 'express';
import auth from '../middlewares/auth.js';
import { requireRole } from '../middlewares/roles.js';
import {
  getTeamChatMessages,
  getTeamBroadcastMessages,
  getDirectMessages,
  sendMessage,
  broadcastMessage,
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/team/chat', auth, getTeamChatMessages); // Team chat room
router.get('/team/broadcast', auth, getTeamBroadcastMessages); // Admin broadcasts
router.get('/user/:userId', auth, getDirectMessages);
router.post('/', auth, sendMessage);
router.post('/admins/message/broadcast', auth, requireRole('admin'), broadcastMessage);

export default router;

