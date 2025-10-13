import React, { useState } from "react";
import {
  Search,
  User,
  Mail,
  Github,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

// Simple Chat Modal Component
const ChatModal = ({ onClose, otherUser, currentUser }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: otherUser.id,
      text: "Hello! How can I help you today?",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      senderId: currentUser.id,
      text: "Hi, I have a question about the assignment.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          senderId: currentUser.id,
          text: newMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
      // In a real app, send to backend/WebSocket
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full h-full max-w-4xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-700 p-4 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{otherUser.name}</h3>
              <p className="text-gray-400 text-sm">{otherUser.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Users className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.senderId === currentUser.id
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === currentUser.id
                      ? "text-yellow-700"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-600"
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const {
    directory,
    friends,
    sendFriendRequest,
    acceptFriendRequest,
    conversations,
  } = useManageStore();

  const currentUser = { id: 1, name: "Julius Dagana" }; // Hardcoded for demo

  const filteredPeople = directory.filter(
    (person) =>
      person.id !== currentUser.id &&
      (person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isFriend = (personId) => friends.includes(personId);
  const hasPendingRequest = (personId) =>
    /* Assume store has pendingFriendRequests */ false; // Placeholder

  const handleSendRequest = (personId) => {
    sendFriendRequest(currentUser.id, personId);
    alert("Friend request sent!");
  };

  const handleMessage = (person) => {
    setSelectedUser(person);
    setIsChatOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Directory</h1>
        <p className="text-gray-400 mt-2">
          Connect with classmates and instructors
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPeople.map((person, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-semibold text-lg">
                    {person.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      person.role === "Instructor"
                        ? "bg-yellow-500 text-gray-900"
                        : person.role === "Teaching Assistant"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {person.role}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {person.cohort || person.specialty}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{person.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Github className="w-4 h-4" />
                    <span>{person.github}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    isFriend(person.id)
                      ? handleMessage(person)
                      : handleSendRequest(person.id)
                  }
                  className={`mt-4 w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isFriend(person.id)
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isFriend(person.id) ? (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Send Friend Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No results found.</p>
        </div>
      )}

      {isChatOpen && selectedUser && (
        <ChatModal
          onClose={() => setIsChatOpen(false)}
          otherUser={selectedUser}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Directory;
