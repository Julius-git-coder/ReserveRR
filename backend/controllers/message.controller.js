import Message from '../models/Message.js';
import User from '../models/User.js';

// Get team chat messages (team chat room)
export const getTeamChatMessages = async (req, res) => {
  try {
    let adminId;
    
    // Get adminId based on user role
    if (req.user.role === 'admin') {
      adminId = req.user.id;
    } else {
      // Student - get their adminId
      const user = await User.findById(req.user.id);
      if (!user || !user.adminId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      adminId = user.adminId;
    }

    // Get team chat messages (isTeamChat: true)
    const messages = await Message.find({
      adminId,
      isTeamChat: true,
    })
      .populate('senderId', 'name email profileImage role')
      .populate('receiverId', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Get team chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get broadcast messages (admin to all team students)
export const getTeamBroadcastMessages = async (req, res) => {
  try {
    let adminId;
    
    if (req.user.role === 'admin') {
      adminId = req.user.id;
    } else {
      const user = await User.findById(req.user.id);
      if (!user || !user.adminId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      adminId = user.adminId;
    }

    // Get broadcast messages (isTeamChat: false, receiverId: null)
    const messages = await Message.find({
      adminId,
      isTeamChat: false,
      receiverId: null,
    })
      .populate('senderId', 'name email profileImage role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get broadcast messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get direct messages with a user
export const getDirectMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.user.id;

    // Verify users exist
    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);
    
    if (!currentUser || !otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify users are in the same team (same adminId)
    let currentAdminId, otherAdminId;
    
    if (currentUser.role === 'admin') {
      currentAdminId = currentUser._id;
    } else {
      currentAdminId = currentUser.adminId;
    }
    
    if (otherUser.role === 'admin') {
      otherAdminId = otherUser._id;
    } else {
      otherAdminId = otherUser.adminId;
    }

    if (!currentAdminId || !otherAdminId || currentAdminId.toString() !== otherAdminId.toString()) {
      return res.status(403).json({ message: 'Users are not in the same team' });
    }

    // Get direct messages between these two users
    const messages = await Message.find({
      isTeamChat: false,
      receiverId: { $ne: null }, // Not a broadcast
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .populate('senderId', 'name email profileImage role')
      .populate('receiverId', 'name email profileImage role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message (for REST API, Socket.io handles real-time)
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, isTeamChat, content, fileUrl } = req.body;
    const senderId = req.user.id;

    // Validation
    if (!content && !fileUrl) {
      return res.status(400).json({ message: 'Content or file is required' });
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Determine adminId
    let adminId;
    if (sender.role === 'admin') {
      adminId = sender._id;
    } else {
      adminId = sender.adminId;
    }

    if (!adminId) {
      return res.status(400).json({ message: 'Invalid sender' });
    }

    // If team chat
    if (isTeamChat) {
      const message = await Message.create({
        senderId,
        receiverId: null,
        adminId,
        isTeamChat: true,
        content: content || null,
        fileUrl: fileUrl || null,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'name email profileImage role')
        .populate('receiverId', 'name email profileImage');

      return res.status(201).json(populatedMessage);
    }

    // Direct message or broadcast
    if (!receiverId) {
      // Broadcast (admin only)
      if (sender.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can broadcast' });
      }

      const message = await Message.create({
        senderId,
        receiverId: null,
        adminId,
        isTeamChat: false,
        content: content || null,
        fileUrl: fileUrl || null,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'name email profileImage role')
        .populate('receiverId', 'name email profileImage');

      return res.status(201).json(populatedMessage);
    }

    // Direct message - verify receiver is in same team
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    let receiverAdminId;
    if (receiver.role === 'admin') {
      receiverAdminId = receiver._id;
    } else {
      receiverAdminId = receiver.adminId;
    }

    if (receiverAdminId.toString() !== adminId.toString()) {
      return res.status(403).json({ message: 'Users are not in the same team' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      adminId,
      isTeamChat: false,
      content: content || null,
      fileUrl: fileUrl || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email profileImage role')
      .populate('receiverId', 'name email profileImage role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin broadcast message (to all team students)
export const broadcastMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { content, fileUrl } = req.body;

    if (!content && !fileUrl) {
      return res.status(400).json({ message: 'Content or file is required' });
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId: null, // Broadcast
      adminId: req.user.id,
      isTeamChat: false,
      content: content || null,
      fileUrl: fileUrl || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email profileImage role')
      .populate('receiverId', 'name email profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Broadcast message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
