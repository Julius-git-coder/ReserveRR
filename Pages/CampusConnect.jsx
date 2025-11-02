import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  User,
  Loader,
} from "lucide-react";
import { usersAPI } from "../src/api/users";
import ChatWindow from "../src/Components/ChatWindow";
import { useSocket } from "../src/context/SocketContext";

const CampusConnect = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { socket, isConnected } = useSocket();

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      // getTeamMembers works for both admin and students
      const members = await usersAPI.getTeamMembers();
      setTeamMembers(members || []);
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  // Listen for real-time profile updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTeamMemberUpdate = () => {
      // Reload team members when any member updates their profile
      loadTeamMembers();
    };

    socket.on('team_member_updated', handleTeamMemberUpdate);

    return () => {
      socket.off('team_member_updated', handleTeamMemberUpdate);
    };
  }, [socket, isConnected]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Campus Connect</h1>
        <p className="text-gray-400 mt-2">
          Connect and chat with your team members
        </p>
      </div>

      {/* Team Chat Button */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <button
          onClick={() => setShowTeamChat(true)}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Open Team Chat Room</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-yellow-500" />
          <span>Team Members ({teamMembers.length})</span>
        </h2>
        {teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No team members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => {
              // Skip self in the list if not admin viewing
              if (member._id === currentUser.id || member.id === currentUser.id) {
                return null;
              }
              return (
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
                      <p className="text-white font-semibold truncate">
                        {member.name}
                        {member.role === "admin" && (
                          <span className="ml-2 bg-yellow-500 text-gray-900 px-2 py-0.5 rounded text-xs">
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {member.email}
                      </p>
                    </div>
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Windows */}
      {showTeamChat && (
        <ChatWindow
          onClose={() => setShowTeamChat(false)}
          currentUser={currentUser}
          isTeamChat={true}
          adminId={currentUser.adminId || currentUser.id}
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

export default CampusConnect;
