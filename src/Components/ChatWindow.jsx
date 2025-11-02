import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { messagesAPI } from '../api/messages';
import { uploadsAPI } from '../api/uploads';
import { User } from 'lucide-react';

const ChatWindow = ({ onClose, otherUser, currentUser, isTeamChat = false, teamId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { socket, isConnected } = useSocket();

  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        let data;
        if (isTeamChat) {
          data = await messagesAPI.getTeamMessages(teamId);
        } else {
          data = await messagesAPI.getDirectMessages(otherUser.id);
        }
        setMessages(data || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if ((otherUser || isTeamChat) && teamId) {
      loadMessages();
    }
  }, [otherUser, isTeamChat, teamId]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      // Check if message is relevant to this chat
      if (isTeamChat) {
        // For team chat, accept all team messages
        if (message.teamId === teamId) {
          setMessages((prev) => [...prev, message]);
        }
      } else {
        // For direct chat, only accept messages between these two users
        const isFromOther = message.senderId._id === otherUser.id;
        const isFromMe = message.senderId._id === currentUser.id;
        const isToMe = message.receiverId && message.receiverId._id === currentUser.id;
        const isToOther = message.receiverId && message.receiverId._id === otherUser.id;

        if ((isFromOther && isToMe) || (isFromMe && isToOther)) {
          setMessages((prev) => [...prev, message]);
        }
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isConnected, otherUser, currentUser, isTeamChat, teamId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !uploading) || isSending || !socket || !isConnected) return;

    setIsSending(true);
    try {
      const messageData = {
        receiverId: isTeamChat ? null : otherUser.id,
        teamId: teamId || currentUser.teamId,
        content: newMessage.trim() || null,
        fileUrl: null,
      };

      socket.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket || !isConnected) return;

    setUploading(true);
    try {
      const { url } = await uploadsAPI.uploadFile(file);
      
      const messageData = {
        receiverId: isTeamChat ? null : otherUser.id,
        teamId: teamId || currentUser.teamId,
        content: null,
        fileUrl: url,
      };

      socket.emit('send_message', messageData);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderName = (senderId) => {
    if (!senderId) return 'Unknown';
    if (senderId._id === currentUser.id) return 'You';
    return senderId.name || 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full h-full max-w-4xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-700 p-4 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-600">
              {!isTeamChat && otherUser?.profileImage ? (
                <img
                  src={otherUser.profileImage}
                  alt={otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {isTeamChat ? `Team Chat - ${teamId}` : otherUser?.name || 'User'}
              </h3>
              <p className="text-gray-400 text-sm">
                {isConnected ? 'Online' : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = msg.senderId._id === currentUser.id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-xs lg:max-w-md">
                    {!isMyMessage && !isTeamChat && (
                      <p className="text-gray-400 text-xs mb-1">
                        {getSenderName(msg.senderId)}
                      </p>
                    )}
                    {isTeamChat && (
                      <p className="text-gray-400 text-xs mb-1">
                        {getSenderName(msg.senderId)}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isMyMessage
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      {msg.content && <p className="break-words">{msg.content}</p>}
                      {msg.fileUrl && (
                        <div className="mt-2">
                          {msg.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img
                              src={msg.fileUrl}
                              alt="Attachment"
                              className="max-w-full h-auto rounded"
                            />
                          ) : (
                            <a
                              href={msg.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline break-all"
                            >
                              View File
                            </a>
                          )}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          isMyMessage ? 'text-yellow-700' : 'text-gray-400'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-600"
        >
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !isConnected}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!isConnected || isSending}
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-yellow-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={(!newMessage.trim() && !uploading) || isSending || !isConnected}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

