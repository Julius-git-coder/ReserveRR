const Message = require('../models/Message');
const User = require('../models/User');

// Get team messages
exports.getTeamMessages = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    // Verify user belongs to this team
    if (req.user.teamId !== teamId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get messages: broadcasts (receiverId === null) or messages involving this user
    const messages = await Message.find({
      teamId,
      $or: [
        { receiverId: null }, // Broadcasts
        { senderId: userId }, // Messages sent by user
        { receiverId: userId }, // Messages received by user
      ],
    })
      .populate('senderId', 'name email profileImage')
      .populate('receiverId', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Get team messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get direct messages with a user
exports.getDirectMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.user.id;

    // Verify users are in the same team
    const otherUser = await User.findById(otherUserId);
    if (!otherUser || otherUser.teamId !== req.user.teamId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({
      teamId: req.user.teamId,
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .populate('senderId', 'name email profileImage')
      .populate('receiverId', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Get direct messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message (for REST API, Socket.io handles real-time)
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, teamId, content, fileUrl } = req.body;
    const senderId = req.user.id;

    // Validation
    if (!teamId || (!content && !fileUrl)) {
      return res.status(400).json({ message: 'Team ID and content or file are required' });
    }

    // Verify user belongs to this team
    if (req.user.teamId !== teamId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If receiverId provided, verify receiver exists and is in same team
    if (receiverId) {
      const receiver = await User.findById(receiverId);
      if (!receiver || receiver.teamId !== teamId) {
        return res.status(400).json({ message: 'Invalid receiver' });
      }
    }

    // Create message
    const message = await Message.create({
      senderId,
      receiverId: receiverId || null,
      teamId,
      content: content || null,
      fileUrl: fileUrl || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email profileImage')
      .populate('receiverId', 'name email profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin broadcast message
exports.broadcastMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { teamId, content, fileUrl } = req.body;

    if (!teamId || (!content && !fileUrl)) {
      return res.status(400).json({ message: 'Team ID and content or file are required' });
    }

    // Verify admin owns this team
    if (req.user.teamId !== teamId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId: null, // Broadcast
      teamId,
      content: content || null,
      fileUrl: fileUrl || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email profileImage')
      .populate('receiverId', 'name email profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Broadcast message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

