import React, { useState, useEffect } from "react";
import { User, Mail, Users, MessageSquare } from "lucide-react";
import { usersAPI } from "../api/users";
import ChatWindow from "./ChatWindow";
import { useSocket } from "../context/SocketContext";

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [showAdminChat, setShowAdminChat] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getMe();
      setUserData(data);

      // Load admin info (we'll need to get admin by teamId)
      // For now, we'll use currentUser data
      if (data.teamId) {
        // You could add an API endpoint to get admin by teamId
        // For now, we'll just show the teamId
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-gray-700">
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              {userData?.name || "Student"}
            </h1>
            <p className="text-gray-400 flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{userData?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Team Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Team ID</p>
              <p className="text-white text-2xl font-bold">
                {userData?.teamId || "N/A"}
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            You are part of team{" "}
            <span className="text-yellow-500 font-semibold">
              {userData?.teamId}
            </span>
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-gray-500"
                }`}
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Connection</p>
              <p className="text-white text-2xl font-bold">
                {isConnected ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            {isConnected
              ? "You can receive messages in real-time"
              : "Reconnecting..."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-4">
          <button
            onClick={() => setShowAdminChat(true)}
            disabled={!isConnected}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Open Team Chat</span>
          </button>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-white text-xl font-semibold mb-4">
          Account Details
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Role</span>
            <span className="text-white font-semibold capitalize">
              {userData?.role || "student"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Email</span>
            <span className="text-white">{userData?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Team ID</span>
            <span className="text-yellow-500 font-semibold">
              {userData?.teamId}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Member Since</span>
            <span className="text-white">
              {userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {showAdminChat && (
        <ChatWindow
          onClose={() => setShowAdminChat(false)}
          currentUser={currentUser}
          isTeamChat={true}
          teamId={userData?.teamId}
        />
      )}
    </div>
  );
};

export default StudentProfile;
