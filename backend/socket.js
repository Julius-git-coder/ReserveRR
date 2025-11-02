import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import User from './models/User.js';

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

      // Determine adminId
      let adminId;
      if (user.role === 'admin') {
        adminId = user._id.toString();
      } else {
        adminId = user.adminId ? user.adminId.toString() : null;
      }

      socket.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        adminId: adminId,
        teamId: user.teamId || null, // Only for admins
        name: user.name,
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`User connected: ${user.name} (${user.role}) - AdminID: ${user.adminId}`);

    if (!user.adminId) {
      socket.emit('error', { message: 'Invalid user configuration' });
      socket.disconnect();
      return;
    }

    // Join team chat room (based on adminId)
    socket.join(`team:${user.adminId}`);
    
    // Join personal room for direct messages
    socket.join(`user:${user.id}`);

    // Handle sending messages
    socket.on('send_message', async (payload) => {
      try {
        const { receiverId, isTeamChat, content, fileUrl, messageType } = payload;

        // Validation
        if (!content && !fileUrl) {
          socket.emit('error', { message: 'Content or file is required' });
          return;
        }

        const sender = await User.findById(user.id);
        if (!sender) {
          socket.emit('error', { message: 'Sender not found' });
          return;
        }

        // Determine adminId for sender
        let adminId;
        if (sender.role === 'admin') {
          adminId = sender._id;
        } else {
          adminId = sender.adminId;
        }

        if (!adminId || adminId.toString() !== user.adminId) {
          socket.emit('error', { message: 'Invalid admin configuration' });
          return;
        }

        // Handle team chat
        if (isTeamChat) {
          const message = await Message.create({
            senderId: user.id,
            receiverId: null,
            adminId,
            isTeamChat: true,
            messageType: messageType || 'General',
            content: content || null,
            fileUrl: fileUrl || null,
          });

          const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'name email profileImage role')
            .populate('receiverId', 'name email profileImage')
            .lean();

          const messageData = {
            _id: populatedMessage._id,
            senderId: {
              _id: populatedMessage.senderId._id,
              name: populatedMessage.senderId.name,
              email: populatedMessage.senderId.email,
              profileImage: populatedMessage.senderId.profileImage,
              role: populatedMessage.senderId.role,
            },
            receiverId: null,
            adminId: populatedMessage.adminId.toString(),
            isTeamChat: true,
            messageType: populatedMessage.messageType || 'General',
            content: populatedMessage.content,
            fileUrl: populatedMessage.fileUrl,
            createdAt: populatedMessage.createdAt,
          };

          // Emit to entire team chat room
          io.to(`team:${adminId.toString()}`).emit('new_message', messageData);
          return;
        }

        // Handle broadcast (admin to all students)
        if (!receiverId) {
          if (user.role !== 'admin') {
            socket.emit('error', { message: 'Only admins can broadcast' });
            return;
          }

          const message = await Message.create({
            senderId: user.id,
            receiverId: null,
            adminId,
            isTeamChat: false,
            messageType: messageType || 'General',
            content: content || null,
            fileUrl: fileUrl || null,
          });

          const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'name email profileImage role')
            .populate('receiverId', 'name email profileImage')
            .lean();

          const messageData = {
            _id: populatedMessage._id,
            senderId: {
              _id: populatedMessage.senderId._id,
              name: populatedMessage.senderId.name,
              email: populatedMessage.senderId.email,
              profileImage: populatedMessage.senderId.profileImage,
              role: populatedMessage.senderId.role,
            },
            receiverId: null,
            adminId: populatedMessage.adminId.toString(),
            isTeamChat: false,
            messageType: populatedMessage.messageType || 'General',
            content: populatedMessage.content,
            fileUrl: populatedMessage.fileUrl,
            createdAt: populatedMessage.createdAt,
          };

          // Emit to entire team (for broadcasts)
          io.to(`team:${adminId.toString()}`).emit('new_message', messageData);
          return;
        }

        // Handle direct message
        const receiver = await User.findById(receiverId);
        if (!receiver) {
          socket.emit('error', { message: 'Receiver not found' });
          return;
        }

        // Verify receiver is in same team
        let receiverAdminId;
        if (receiver.role === 'admin') {
          receiverAdminId = receiver._id;
        } else {
          receiverAdminId = receiver.adminId;
        }

        if (!receiverAdminId || receiverAdminId.toString() !== adminId.toString()) {
          socket.emit('error', { message: 'Users are not in the same team' });
          return;
        }

        const message = await Message.create({
          senderId: user.id,
          receiverId,
          adminId,
          isTeamChat: false,
          messageType: messageType || 'Direct',
          content: content || null,
          fileUrl: fileUrl || null,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name email profileImage role')
          .populate('receiverId', 'name email profileImage role')
          .lean();

        const messageData = {
          _id: populatedMessage._id,
          senderId: {
            _id: populatedMessage.senderId._id,
            name: populatedMessage.senderId.name,
            email: populatedMessage.senderId.email,
            profileImage: populatedMessage.senderId.profileImage,
            role: populatedMessage.senderId.role,
          },
          receiverId: populatedMessage.receiverId ? {
            _id: populatedMessage.receiverId._id,
            name: populatedMessage.receiverId.name,
            email: populatedMessage.receiverId.email,
            profileImage: populatedMessage.receiverId.profileImage,
            role: populatedMessage.receiverId.role,
          } : null,
          adminId: populatedMessage.adminId.toString(),
          isTeamChat: false,
          messageType: populatedMessage.messageType || 'Direct',
          content: populatedMessage.content,
          fileUrl: populatedMessage.fileUrl,
          createdAt: populatedMessage.createdAt,
        };

        // Emit to both sender and receiver for direct messages
        io.to(`user:${receiverId}`).to(`user:${user.id}`).emit('new_message', messageData);
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

  // Function to emit profile updates (called from user controller)
  const emitProfileUpdate = (updatedUser, adminId) => {
    // Emit to user's personal room
    io.to(`user:${updatedUser._id.toString()}`).emit('profile_updated', {
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
        studentId: updatedUser.studentId || null,
        teamId: updatedUser.teamId || null,
      },
    });

    // Emit to team room for real-time updates across the system
    if (adminId) {
      io.to(`team:${adminId.toString()}`).emit('team_member_updated', {
        user: {
          id: updatedUser._id.toString(),
          name: updatedUser.name,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
          role: updatedUser.role,
          studentId: updatedUser.studentId || null,
        },
      });
    }
  };

  // Make emitProfileUpdate available globally (attach to io object)
  io.emitProfileUpdate = emitProfileUpdate;

  return io;
};

export default setupSocket;
