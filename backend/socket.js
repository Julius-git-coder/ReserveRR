const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // In production, specify your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        name: user.name,
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`User connected: ${user.name} (${user.role}) - Team: ${user.teamId}`);

    // Join team room for broadcasts
    socket.join(`team:${user.teamId}`);
    
    // Join personal room for direct messages
    socket.join(`user:${user.id}`);

    // Handle sending messages
    socket.on('send_message', async (payload) => {
      try {
        const { receiverId, teamId, content, fileUrl } = payload;

        // Validation
        if (!teamId || (!content && !fileUrl)) {
          socket.emit('error', { message: 'Team ID and content or file are required' });
          return;
        }

        // Verify user belongs to this team
        if (user.teamId !== teamId) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // If receiverId provided, verify receiver exists and is in same team
        let receiver = null;
        if (receiverId) {
          receiver = await User.findById(receiverId);
          if (!receiver || receiver.teamId !== teamId) {
            socket.emit('error', { message: 'Invalid receiver' });
            return;
          }
        }

        // Create message in database
        const message = await Message.create({
          senderId: user.id,
          receiverId: receiverId || null,
          teamId,
          content: content || null,
          fileUrl: fileUrl || null,
        });

        // Populate message with user data
        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name email profileImage')
          .populate('receiverId', 'name email profileImage')
          .lean();

        // Convert to plain object for socket emission
        const messageData = {
          _id: populatedMessage._id,
          senderId: {
            _id: populatedMessage.senderId._id,
            name: populatedMessage.senderId.name,
            email: populatedMessage.senderId.email,
            profileImage: populatedMessage.senderId.profileImage,
          },
          receiverId: populatedMessage.receiverId ? {
            _id: populatedMessage.receiverId._id,
            name: populatedMessage.receiverId.name,
            email: populatedMessage.receiverId.email,
            profileImage: populatedMessage.receiverId.profileImage,
          } : null,
          teamId: populatedMessage.teamId,
          content: populatedMessage.content,
          fileUrl: populatedMessage.fileUrl,
          createdAt: populatedMessage.createdAt,
        };

        // Emit to appropriate recipients
        if (!receiverId) {
          // Broadcast to entire team
          io.to(`team:${teamId}`).emit('new_message', messageData);
        } else {
          // Private message: send to receiver and sender
          io.to(`user:${receiverId}`).to(`user:${user.id}`).emit('new_message', messageData);
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.name}`);
    });
  });

  return io;
};

module.exports = setupSocket;

