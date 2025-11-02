import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Send, User, AlertCircle, Loader } from 'lucide-react';
import { usersAPI } from '../api/users';
import { messagesAPI } from '../api/messages';
import ChatWindow from './ChatWindow';
import { useSocket } from '../context/SocketContext';

const AdminDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState({ teamSize: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [broadcastContent, setBroadcastContent] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, statsData] = await Promise.all([
        usersAPI.getTeamMembers(), // No parameter needed - uses auth
        usersAPI.getAdminStats(),
      ]);
      // Filter out admin from members list for display (admin is included in response)
      const students = (membersData || []).filter(m => (m._id || m.id) !== currentUser.id);
      setTeamMembers(students);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastContent.trim() || sendingBroadcast || !socket || !isConnected) return;

    setSendingBroadcast(true);
    try {
      const messageData = {
        receiverId: null, // null = broadcast to all team students
        isTeamChat: false, // false = broadcast, true = team chat
        content: broadcastContent.trim(),
        fileUrl: null,
      };

      socket.emit('send_message', messageData);
      setBroadcastContent('');
    } catch (error) {
      console.error('Error sending broadcast:', error);
    } finally {
      setSendingBroadcast(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h1 className="text-white text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your team and communicate with students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Team Size</p>
              <p className="text-white text-2xl font-bold">{stats.teamSize}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Team ID</p>
              <p className="text-white text-2xl font-bold">{currentUser.teamId}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Connection</p>
              <p className="text-white text-2xl font-bold">{isConnected ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center space-x-2">
          <Send className="w-5 h-5 text-yellow-500" />
          <span>Broadcast to Team</span>
        </h2>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <textarea
            value={broadcastContent}
            onChange={(e) => setBroadcastContent(e.target.value)}
            placeholder="Type a message to broadcast to all team members..."
            disabled={!isConnected || sendingBroadcast}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500 disabled:opacity-50 min-h-[100px]"
          />
          <button
            type="submit"
            disabled={!broadcastContent.trim() || sendingBroadcast || !isConnected}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {sendingBroadcast ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Broadcast</span>
              </>
            )}
          </button>
        </form>
        <button
          onClick={() => setShowTeamChat(true)}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Open Team Chat</span>
        </button>
      </div>

      {/* Team Members */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-yellow-500" />
          <span>Team Members ({teamMembers.length})</span>
        </h2>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No team members yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Share your Team ID: <span className="text-yellow-500 font-semibold">{currentUser.teamId}</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member._id || member.id}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-yellow-500 transition-colors cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-600">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{member.name}</p>
                    <p className="text-gray-400 text-sm truncate">{member.email}</p>
                  </div>
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Windows */}
      {showTeamChat && (
        <ChatWindow
          onClose={() => setShowTeamChat(false)}
          currentUser={currentUser}
          isTeamChat={true}
          adminId={currentUser.id} // Admin's ID is the adminId for the team
        />
      )}

      {selectedMember && (
        <ChatWindow
          onClose={() => setSelectedMember(null)}
          otherUser={selectedMember}
          currentUser={currentUser}
          isTeamChat={false}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

