import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Send, User, AlertCircle, Loader, Copy, Check, Key, Camera } from 'lucide-react';
import { usersAPI } from '../api/users';
import { messagesAPI } from '../api/messages';
import { uploadsAPI } from '../api/uploads';
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
  const [copied, setCopied] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    loadData();
    loadUserProfile();
  }, []);

  // Listen for real-time profile updates via socket.io
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleProfileUpdate = (data) => {
      const updatedUser = data.user;
      // Update currentUser if it's the current user
      const localCurrentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (updatedUser.id === localCurrentUser.id) {
        const updatedCurrentUser = { ...localCurrentUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
        setUserProfile(updatedUser);
      }
      // Reload team members to get updated profile images
      loadData();
    };

    const handleTeamMemberUpdate = (data) => {
      // Reload team members when any team member updates their profile
      loadData();
    };

    socket.on('profile_updated', handleProfileUpdate);
    socket.on('team_member_updated', handleTeamMemberUpdate);

    return () => {
      socket.off('profile_updated', handleProfileUpdate);
      socket.off('team_member_updated', handleTeamMemberUpdate);
    };
  }, [socket, isConnected]); // Removed currentUser dependency to avoid stale closures

  const loadUserProfile = async () => {
    try {
      const profile = await usersAPI.getMe();
      setUserProfile(profile);
      // Update currentUser in localStorage if needed
      if (profile.profileImage && !currentUser.profileImage) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, profileImage: profile.profileImage }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

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

  const copyTeamId = () => {
    if (currentUser.teamId) {
      navigator.clipboard.writeText(currentUser.teamId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setUploadingImage(true);
    try {
      // Upload file to backend
      const { url } = await uploadsAPI.uploadFile(file);
      
      // Update user profile with the image URL
      const updatedUser = await usersAPI.updateProfile({ profileImage: url });
      
      // Update local storage
      const updatedCurrentUser = { ...currentUser, profileImage: url };
      localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      
      // Update state
      setUserProfile(updatedUser);
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
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
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-yellow-500 transition-colors">
                {(userProfile?.profileImage || currentUser.profileImage) ? (
                  <img
                    src={userProfile?.profileImage || currentUser.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                disabled={uploadingImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full disabled:cursor-not-allowed"
              />
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3 text-gray-900" />
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <Loader className="w-5 h-5 text-yellow-500 animate-spin" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your team and communicate with students</p>
            </div>
          </div>
          {/* Team ID Display - Prominent */}
          <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4 min-w-[280px]">
            <div className="flex items-center space-x-2 mb-2">
              <Key className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-500 font-semibold text-sm">Your Team ID</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-white font-bold text-xl flex-1 bg-gray-900 px-3 py-2 rounded">
                {currentUser.teamId || 'N/A'}
              </code>
              <button
                onClick={copyTeamId}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                title="Copy Team ID"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">Share this ID with students to join your team</p>
          </div>
        </div>
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

