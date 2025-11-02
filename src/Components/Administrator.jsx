import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  MessageSquare,
  X,
  User,
  Mail,
  Bell,
  Calendar,
  Clock,
  Map,
  Briefcase,
  Dumbbell,
  FolderOpen,
  Edit,
  Trash2,
  UserCheck,
  Download,
  CheckCircle,
  Settings,
} from "lucide-react";
import useManageStore from "../Store/useManageStore";
import { usersAPI } from "../api/users";
import { uploadsAPI } from "../api/uploads";
import { useSocket } from "../context/SocketContext";
import { messagesAPI } from "../api/messages";

// Updated Sessions Management Section Component
const SessionsManagement = ({
  directory,
  approveSession,
  rejectSession,
  startSession,
  deleteSession,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("pending"); // pending, approved, all
  const [zoomLinkInput, setZoomLinkInput] = useState({});
  const sessions = useManageStore((state) => state.sessions);
  // Filter sessions
  const pendingSessions = sessions.filter((s) => s.status === "pending");
  const approvedSessions = sessions.filter((s) => s.status === "approved");
  const allSessions = sessions;
  const currentSessions =
    activeSubTab === "pending"
      ? pendingSessions
      : activeSubTab === "approved"
      ? approvedSessions
      : allSessions;
  const handleStartSession = (sessionId, sessionDate, sessionTime) => {
    const sessionTimeDate = new Date(`${sessionDate}T${sessionTime}:00`);
    const now = new Date();
    if (now >= sessionTimeDate) {
      startSession(sessionId);
      alert("Session started! Zoom link generated.");
    } else {
      alert(`Session starts at ${sessionTime}. Please wait.`);
    }
  };
  const handleApproveSession = (sessionId) => {
    const zoomLink = zoomLinkInput[sessionId] || "";
    if (!zoomLink) {
      alert("Please enter a Zoom link.");
      return;
    }
    if (!/https?:\/\/[^\s]+/.test(zoomLink)) {
      alert("Please enter a valid Zoom link.");
      return;
    }
    approveSession(sessionId, zoomLink);
    setZoomLinkInput((prev) => ({ ...prev, [sessionId]: "" }));
    alert("Session approved! Notification sent to student.");
  };
  const getStudentName = (studentId) => {
    const student = directory.find((u) => u.id === studentId);
    return student ? student.name : "Unknown Student";
  };
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Session Management</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSubTab("pending")}
          className={`px-4 py-2 rounded-lg ${
            activeSubTab === "pending"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Pending ({pendingSessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("approved")}
          className={`px-4 py-2 rounded-lg ${
            activeSubTab === "approved"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Approved ({approvedSessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("all")}
          className={`px-4 py-2 rounded-lg ${
            activeSubTab === "all"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          All Sessions
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {currentSessions.length === 0 ? (
          <p className="text-gray-400 text-center">No sessions found.</p>
        ) : (
          <div className="space-y-4">
            {currentSessions.map((session) => {
              const studentName = getStudentName(session.studentId);
              const isTimeReached = () => {
                const sessionTimeDate = new Date(
                  `${session.date}T${session.time}:00`
                );
                return new Date() >= sessionTimeDate;
              };
              return (
                <div
                  key={session.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold">
                        {session.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          session.status === "pending"
                            ? "bg-yellow-500 text-gray-900"
                            : session.status === "approved"
                            ? "bg-green-500 text-white"
                            : session.status === "started"
                            ? "bg-blue-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">Student: {studentName}</p>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {session.time} ({session.duration})
                        </span>
                      </div>
                      {session.notes && <p>Notes: {session.notes}</p>}
                      {session.zoomLink && (
                        <p className="text-blue-400">
                          Zoom:{" "}
                          <a
                            href={session.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {session.zoomLink}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 ml-4 flex-shrink-0">
                    {session.status === "pending" && (
                      <>
                        <input
                          type="text"
                          value={zoomLinkInput[session.id] || ""}
                          onChange={(e) =>
                            setZoomLinkInput((prev) => ({
                              ...prev,
                              [session.id]: e.target.value,
                            }))
                          }
                          placeholder="Enter Zoom link"
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
                        />
                        <button
                          onClick={() => handleApproveSession(session.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm w-full"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectSession(session.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm w-full"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {session.status === "approved" && (
                      <button
                        onClick={() =>
                          handleStartSession(
                            session.id,
                            session.date,
                            session.time
                          )
                        }
                        disabled={!isTimeReached()}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm w-full"
                      >
                        {isTimeReached() ? "Start" : "Wait for Time"}
                      </button>
                    )}
                    {session.status === "started" && (
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-full text-center block hover:bg-blue-600"
                      >
                        Join Zoom
                      </a>
                    )}
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
// New Team Messaging Section - Local only
const TeamMessaging = () => {
  const [message, setMessage] = useState("");
  const [teamMessages, setTeamMessages] = useState([]);
  const addNotification = useManageStore((state) => state.addNotification);
  const handleSendTeamMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const timestamp = new Date().toISOString();
      const messageId = Date.now().toString();
      setTeamMessages((prev) => [
        ...prev,
        { id: messageId, message, timestamp },
      ]);
      // Notify all students
      const state = useManageStore.getState();
      const students = state.directory.filter((u) => u.role === "Student");
      const newNotifs = students.map((student, index) => ({
        id: Date.now() + index,
        userId: student.id,
        type: "team_message",
        messageId,
        message,
        read: false,
        timestamp,
      }));
      newNotifs.forEach((notif) => addNotification(notif));
      setMessage("");
    }
  };
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Team Messaging</h2>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <form onSubmit={handleSendTeamMessage} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send message to entire team..."
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {teamMessages
            .sort((a, b) =>
              new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1
            )
            .map((msg) => (
              <div key={msg.id} className="text-sm text-gray-300">
                {msg.message} - {new Date(msg.timestamp).toLocaleString()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
// Admin Settings Component - Delete and Suspend Students (Side Modal)
const AdminSettings = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const { socket, isConnected } = useSocket();

  const loadStudents = async () => {
    try {
      setLoading(true);
      const teamMembers = await usersAPI.getTeamMembers();
      const studentList = (teamMembers || []).filter(
        (m) => m.role === "student"
      );
      setStudents(studentList);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Listen for real-time profile updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTeamMemberUpdate = () => {
      // Reload students when any team member updates their profile
      loadStudents();
    };

    socket.on('team_member_updated', handleTeamMemberUpdate);

    return () => {
      socket.off('team_member_updated', handleTeamMemberUpdate);
    };
  }, [socket, isConnected]);

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [studentId]: 'delete' }));
    try {
      await usersAPI.deleteStudent(studentId);
      // Remove student from list
      setStudents(students.filter(s => (s.id || s._id) !== studentId));
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert(error.response?.data?.message || "Failed to delete student");
    } finally {
      setActionLoading((prev) => ({ ...prev, [studentId]: null }));
    }
  };

  const handleSuspendStudent = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const action = newStatus === 'suspended' ? 'suspend' : 'activate';
    
    if (!confirm(`Are you sure you want to ${action} this student?`)) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [studentId]: 'suspend' }));
    try {
      const response = await usersAPI.updateStudentStatus(studentId, newStatus);
      // Update student in list
      setStudents(students.map(s => 
        (s.id || s._id) === studentId 
          ? { ...s, status: newStatus }
          : s
      ));
      alert(response.message || `Student ${action}d successfully!`);
    } catch (error) {
      console.error("Error updating student status:", error);
      alert(error.response?.data?.message || `Failed to ${action} student`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [studentId]: null }));
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity z-40"
        onClick={onClose}
      />
      
      {/* Side Modal */}
      <div 
        className="absolute right-0 top-0 bottom-0 bg-gray-800 w-full max-w-2xl h-full overflow-y-auto shadow-2xl transform transition-transform duration-300 ease-out z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-white text-2xl font-bold">Student Management</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-white transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <p className="text-gray-400 text-center">No students in your team yet.</p>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr className="border-b border-gray-600">
                      <th className="text-left text-gray-300 font-semibold p-3">Name</th>
                      <th className="text-left text-gray-300 font-semibold p-3">Email</th>
                      <th className="text-left text-gray-300 font-semibold p-3">Student ID</th>
                      <th className="text-left text-gray-300 font-semibold p-3">Status</th>
                      <th className="text-left text-gray-300 font-semibold p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id || student._id} className="border-b border-gray-600 hover:bg-gray-600 transition-colors">
                        <td className="p-3 text-white">{student.name}</td>
                        <td className="p-3 text-gray-300">{student.email}</td>
                        <td className="p-3 text-gray-300">{student.studentId || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            student.status === 'suspended' 
                              ? 'bg-red-500 bg-opacity-20 text-red-400' 
                              : 'bg-green-500 bg-opacity-20 text-green-400'
                          }`}>
                            {student.status === 'suspended' ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSuspendStudent(student.id || student._id, student.status || 'active')}
                              disabled={actionLoading[student.id || student._id] === 'suspend'}
                              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                student.status === 'suspended'
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {actionLoading[student.id || student._id] === 'suspend' ? 'Processing...' : student.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id || student._id)}
                              disabled={actionLoading[student.id || student._id] === 'delete'}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading[student.id || student._id] === 'delete' ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Fixed Private Messaging Section - Now uses real-time socket.io messaging
const PrivateMessaging = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageType, setMessageType] = useState('direct'); // 'direct' or 'broadcast' or 'all_students'
  const [messageCategory, setMessageCategory] = useState('General'); // 'Announcement', 'Assignment', 'Project', 'Exercise', 'General'
  const [privateMessage, setPrivateMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { socket, isConnected } = useSocket();
  
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const teamMembers = await usersAPI.getTeamMembers();
        const studentList = (teamMembers || []).filter(
          (m) => m.role === "student"
        );
        setStudents(studentList);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStudents();
  }, []);

  // Load messages when student is selected or message type changes
  useEffect(() => {
    const loadMessages = async () => {
      if (messageType === 'broadcast' || messageType === 'all_students' || selectedStudent) {
        try {
          // For broadcast/all_students, load broadcast messages
          // For direct, load direct messages with selected student
          let data = [];
          if (messageType === 'broadcast' || messageType === 'all_students') {
            data = await messagesAPI.getTeamBroadcastMessages();
          } else if (selectedStudent) {
            data = await messagesAPI.getDirectMessages(selectedStudent.id || selectedStudent._id);
          }
          setMessages(data || []);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    };

    loadMessages();
  }, [selectedStudent, messageType]);

  // Listen for real-time messages via socket.io
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      if (messageType === 'broadcast' || messageType === 'all_students') {
        // For broadcast/all_students, accept all broadcast messages (isTeamChat: false, receiverId: null)
        if (!message.isTeamChat && !message.receiverId) {
          setMessages((prev) => [...prev, message]);
        }
      } else if (selectedStudent) {
        // For direct messages, only accept messages between admin and selected student
        const studentId = selectedStudent.id || selectedStudent._id;
        const adminId = currentUser.id || currentUser._id;
        
        const isDirectMessage = !message.isTeamChat && message.receiverId;
        const isToOrFromSelected = 
          (message.senderId?._id === studentId || message.senderId?._id?.toString() === studentId) ||
          (message.receiverId?._id === studentId || message.receiverId?._id?.toString() === studentId);
        const isFromOrToAdmin =
          (message.senderId?._id === adminId || message.senderId?._id?.toString() === adminId) ||
          (message.receiverId?._id === adminId || message.receiverId?._id?.toString() === adminId);

        if (isDirectMessage && isToOrFromSelected && isFromOrToAdmin) {
          setMessages((prev) => [...prev, message]);
        }
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isConnected, selectedStudent, messageType, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!privateMessage.trim() || sending || !socket || !isConnected) return;

    if (messageType === 'broadcast' || messageType === 'all_students') {
      // Send broadcast to all students
      if (currentUser.role !== 'admin') {
        alert('Only admins can send broadcasts');
        return;
      }
    } else if (!selectedStudent) {
      alert("Please select a student or choose 'ALL Students' for broadcast.");
      return;
    }

    setSending(true);
    try {
      const messageData = {
        receiverId: (messageType === 'broadcast' || messageType === 'all_students') ? null : (selectedStudent.id || selectedStudent._id),
        isTeamChat: false, // false for broadcast or direct, true for team chat
        messageType: messageCategory, // Use message category (Announcement, Assignment, etc.)
        content: privateMessage.trim(),
        fileUrl: null,
      };

      socket.emit('send_message', messageData);
      setPrivateMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Messaging</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Message Type</h3>
          
          {/* Message Category Selector */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Message Category</label>
            <select
              value={messageCategory}
              onChange={(e) => setMessageCategory(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 mb-4"
            >
              <option value="General">General</option>
              <option value="Announcement">Announcement</option>
              <option value="Assignment">Assignment</option>
              <option value="Project">Project</option>
              <option value="Exercise">Exercise</option>
            </select>
          </div>

          {/* Recipient Type Selector */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Recipient</label>
            <select
              value={messageType}
              onChange={(e) => {
                setMessageType(e.target.value);
                if (e.target.value !== 'direct') {
                  setSelectedStudent(null);
                }
                setMessages([]);
              }}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
            >
              <option value="all_students">ALL Students</option>
              <option value="broadcast">Broadcast to All Students</option>
              <option value="direct">Direct Message to Specific Student</option>
            </select>
          </div>
          
          {messageType === 'direct' && (
            <>
              <h3 className="text-white font-semibold mb-4 mt-4">Select Student</h3>
              {loading ? (
                <div className="text-gray-400">Loading students...</div>
              ) : (
                <select
                  value={selectedStudent ? (selectedStudent.id || selectedStudent._id) : ''}
                  onChange={(e) => {
                    const student = students.find(
                      (s) => (s.id || s._id) === e.target.value
                    );
                    setSelectedStudent(student);
                    setMessages([]);
                  }}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
                >
                  <option value="">Choose a student by ID</option>
                  {students.map((student) => (
                    <option key={student.id || student._id} value={student.id || student._id}>
                      {student.studentId || 'N/A'} - {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
        
        {(messageType === 'broadcast' || messageType === 'all_students' || selectedStudent) && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-2">
              {messageType === 'broadcast' || messageType === 'all_students' 
                ? `Send ${messageCategory} to ALL Students` 
                : `Send ${messageCategory} to ${selectedStudent.name}`}
            </h3>
            {messageType === 'direct' && (
              <p className="text-gray-400 text-sm mb-4">
                Student ID: {selectedStudent.studentId || 'N/A'} - {selectedStudent.email}
              </p>
            )}
            <form onSubmit={handleSendMessage}>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  placeholder={messageType === 'broadcast' ? 'Type broadcast message...' : 'Send private message...'}
                  disabled={!isConnected || sending}
                  className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!privateMessage.trim() || sending || !isConnected}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto border-t border-gray-700 pt-4 mt-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="text-sm text-gray-300 flex justify-between p-2 bg-gray-700 rounded"
                >
                  <span>{msg.content}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(msg.createdAt || msg.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No messages yet.</p>
              )}
            </div>
            {!isConnected && (
              <p className="text-yellow-500 text-xs mt-2">Connecting to server...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// New Roadmap Management Section Component
const RoadmapManagement = ({
  roadmapItems,
  setCurrentWeek,
  markWeekPassed,
}) => {
  if (roadmapItems.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-white text-2xl font-bold mb-6">
          Roadmap Management
        </h2>
        <p className="text-gray-400">No roadmap items found.</p>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Roadmap Management</h2>
      <div className="space-y-6">
        {roadmapItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">
                {item.phase} - {item.term} ({item.status})
              </h3>
            </div>
            {item.weeks && item.weeks.length > 0 ? (
              <div className="space-y-4">
                {item.weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex items-center justify-between p-4 bg-gray-900 rounded border border-gray-700"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        Week {week.weekNumber}: {week.topic}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Subtopics: {week.subTopics?.length || 0} | Status:{" "}
                        {week.current
                          ? "Current"
                          : week.next
                          ? "Next"
                          : week.passed
                          ? "Completed"
                          : "Future"}
                      </p>
                    </div>
                    <div className="space-x-2 flex-shrink-0">
                      {week.current ? (
                        <button
                          onClick={() => setCurrentWeek(item.id, null)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold"
                        >
                          Unset Current
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentWeek(item.id, weekIndex)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded text-sm font-semibold"
                        >
                          Set Current
                        </button>
                      )}
                      <button
                        onClick={() => markWeekPassed(item.id, weekIndex)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No weeks added yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const ChatModal = ({ onClose, otherUser, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { conversations, addMessage, directory } = useManageStore();
  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );
  const convKey = [
    Math.min(currentUser.id, otherUser.id),
    Math.max(currentUser.id, otherUser.id),
  ].join("-");
  useEffect(() => {
    setMessages(conversations[convKey] || []);
  }, [conversations, convKey]);
  // Mark unread notifications from this user as read when chat opens
  useEffect(() => {
    const state = useManageStore.getState();
    const unreadNotifs = state.notifications.filter(
      (n) =>
        n.userId === currentUser.id &&
        !n.read &&
        n.fromUserId === otherUser.id &&
        n.type === "message"
    );
    unreadNotifs.forEach((notif) => {
      markNotificationAsRead(notif.id);
    });
  }, [currentUser.id, otherUser.id, markNotificationAsRead]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessage(currentUser.id, otherUser.id, currentUser.id, newMessage);
      setNewMessage("");
    }
  };
  const otherUserProfile = directory.find((u) => u.id === otherUser.id);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full h-full max-w-4xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-700 p-4 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              {otherUserProfile?.pictureUrl ? (
                <img
                  src={otherUserProfile.pictureUrl}
                  alt={otherUserProfile?.name || otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {otherUserProfile?.name || otherUser.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {otherUserProfile?.role || otherUser.role}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
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
// Notification Modal Component (updated to match student's for bi-directional)
const NotificationModal = ({
  isOpen,
  onClose,
  userId,
  directory,
  conversations,
  markNotificationAsRead,
  onOpenChat,
  sessions,
  programs,
}) => {
  if (!isOpen) return null;
  const notifications = useManageStore
    .getState()
    .notifications.filter((n) => n.userId === userId && !n.read)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  if (notifications.length === 0) {
    return (
      <div className="fixed right-4 top-20 w-80 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
        <div className="p-4 border-b border-gray-600">
          <h3 className="text-white font-semibold">Notifications</h3>
        </div>
        <div className="p-4 text-gray-400 text-center">
          No new notifications
        </div>
        <button
          onClick={onClose}
          className="w-full p-2 hover:bg-gray-700 text-gray-300"
        >
          Close
        </button>
      </div>
    );
  }
  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    onClose();
    if (notif.type === "message") {
      const sender = directory.find((u) => u.id === notif.fromUserId);
      if (sender && onOpenChat) {
        onOpenChat(sender);
      }
    } else if (notif.type === "session_booked") {
      alert(`New session booked. Check Sessions Management.`);
    } else if (notif.type === "program_join_requested") {
      alert(`New program join request. Check Programs.`);
    } else if (notif.type === "friend_request_received") {
      alert(`New friend request received. Check Social Connections.`);
    }
  };
  return (
    <div className="fixed right-4 top-20 w-80 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-white font-semibold">
          Notifications ({notifications.length})
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="divide-y divide-gray-700">
        {notifications.map((notif) => {
          if (notif.type === "message") {
            const sender = directory.find((u) => u.id === notif.fromUserId);
            const convKey = [
              Math.min(userId, notif.fromUserId),
              Math.max(userId, notif.fromUserId),
            ].join("-");
            const messages = conversations[convKey] || [];
            const message = messages.find((m) => m.id === notif.messageId);
            const preview = message
              ? `${message.text.slice(0, 50)}${
                  message.text.length > 50 ? "..." : ""
                }`
              : "New message";
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {sender?.pictureUrl ? (
                      <img
                        src={sender.pictureUrl}
                        alt={sender?.name || "Sender"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {sender?.name || "Unknown"}
                    </p>
                    <p className="text-gray-300 text-sm truncate">{preview}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else if (notif.type === "session_booked") {
            const session = sessions.find((s) => s.id === notif.sessionId);
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      New Session Booked
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {notif.message}
                    </p>
                    {session && (
                      <p className="text-gray-500 text-xs mt-1">
                        {session.title} on{" "}
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          } else if (notif.type === "program_join_requested") {
            const program = programs.find((p) => p.id === notif.programId);
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      Program Join Request
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {notif.message}
                    </p>
                    {program && (
                      <p className="text-gray-500 text-xs mt-1">
                        {program.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          } else if (notif.type === "friend_request_received") {
            const sender = directory.find((u) => u.id === notif.fromUserId);
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      Friend Request
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {notif.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else {
            // Handle other notifications
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">Update</p>
                    <p className="text-gray-300 text-sm truncate">
                      {notif.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

const Administrator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState(null);
  const markAsRead = useManageStore((state) => state.markAsRead);
  const { directory, conversations } = useManageStore();
  const userId = 2;
  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );
  const updateUser = useManageStore((state) => state.updateUser);
  // Removed Firebase UID fetch, use static count from directory
  useEffect(() => {
    const count = directory.filter((u) => u.role === "Student").length;
    setStudentCount(count);
  }, [directory]);
  const { socket, isConnected } = useSocket();

  // Load admin profile from API on mount
  const loadAdminProfile = useCallback(async () => {
    try {
      const userData = await usersAPI.getMe();
      // Map profileImage to pictureUrl for compatibility with existing code
      const profileData = {
        ...userData,
        pictureUrl: userData.profileImage,
        id: userData.id || userData._id,
        _id: userData.id || userData._id,
      };
      setAdminProfile(profileData);
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Error loading admin profile:", error);
      // Fallback to directory if API fails
      const admin = directory.find((u) => u.id === 2);
      if (admin) {
        setAdminProfile(admin);
      }
    }
  }, [directory]);

  useEffect(() => {
    loadAdminProfile();
  }, [loadAdminProfile]);

  // Listen for real-time profile updates via socket.io
  useEffect(() => {
    if (!socket || !isConnected || !loadAdminProfile) return;

    const handleProfileUpdate = (data) => {
      const updatedUser = data.user;
      const localCurrentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Update if it's the current admin user
      if (updatedUser.id === (localCurrentUser.id || localCurrentUser._id)) {
        const updatedCurrentUser = { ...localCurrentUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
        
        // Update admin profile with new data
        const updatedProfile = {
          ...updatedUser,
          pictureUrl: updatedUser.profileImage,
          id: updatedUser.id,
          _id: updatedUser.id,
        };
        setAdminProfile(updatedProfile);
      }
    };

    const handleTeamMemberUpdate = (data) => {
      // Reload admin profile when team members update (to refresh directory)
      loadAdminProfile();
    };

    socket.on('profile_updated', handleProfileUpdate);
    socket.on('team_member_updated', handleTeamMemberUpdate);

    return () => {
      socket.off('profile_updated', handleProfileUpdate);
      socket.off('team_member_updated', handleTeamMemberUpdate);
    };
  }, [socket, isConnected, loadAdminProfile]);
  const handleBellClick = () => {
    setIsNotificationOpen(true);
  };
  const handleOpenChatFromNotification = (sender) => {
    setSelectedUser(sender);
    setIsChatOpen(true);
  };
  // Store selectors
  const announcements = useManageStore((state) => state.announcements);
  const events = useManageStore((state) => state.events);
  const assignments = useManageStore((state) => state.assignments);
  const exercises = useManageStore((state) => state.exercises);
  const projects = useManageStore((state) => state.projects);
  const attendance = useManageStore((state) => state.attendance);
  const roadmapItems = useManageStore((state) => state.roadmapItems);
  const classMaterials = useManageStore((state) => state.classMaterials);
  const programs = useManageStore((state) => state.programs);
  const sessions = useManageStore((state) => state.sessions);
  const friendRequests = useManageStore((state) => state.friendRequests);
  const pendingRequests = useMemo(
    () => friendRequests.filter((r) => r.toId === 2 && r.status === "pending"),
    [friendRequests]
  );
  const friendsForAdmin = useMemo(
    () =>
      friendRequests
        .filter(
          (r) => (r.fromId === 2 || r.toId === 2) && r.status === "accepted"
        )
        .map((r) => (r.fromId === 2 ? r.toId : r.fromId)),
    [friendRequests]
  );
  const conversationsAdmin = useManageStore((state) => state.conversations);
  const acceptFriendRequest = useManageStore(
    (state) => state.acceptFriendRequest
  );
  const rejectFriendRequest = useManageStore(
    (state) => state.rejectFriendRequest
  );
  const addMessage = useManageStore((state) => state.addMessage);
  // Store actions
  const addAnnouncement = useManageStore((state) => state.addAnnouncement);
  const updateAnnouncement = useManageStore(
    (state) => state.updateAnnouncement
  );
  const deleteAnnouncement = useManageStore(
    (state) => state.deleteAnnouncement
  );
  const addEvent = useManageStore((state) => state.addEvent);
  const updateEvent = useManageStore((state) => state.updateEvent);
  const deleteEvent = useManageStore((state) => state.deleteEvent);
  const addAssignment = useManageStore((state) => state.addAssignment);
  const updateAssignment = useManageStore((state) => state.updateAssignment);
  const deleteAssignment = useManageStore((state) => state.deleteAssignment);
  const addExercise = useManageStore((state) => state.addExercise);
  const updateExercise = useManageStore((state) => state.updateExercise);
  const deleteExercise = useManageStore((state) => state.deleteExercise);
  const addProject = useManageStore((state) => state.addProject);
  const updateProject = useManageStore((state) => state.updateProject);
  const deleteProject = useManageStore((state) => state.deleteProject);
  const addAttendance = useManageStore((state) => state.addAttendance);
  const updateAttendance = useManageStore((state) => state.updateAttendance);
  const deleteAttendance = useManageStore((state) => state.deleteAttendance);
  const addRoadmapItem = useManageStore((state) => state.addRoadmapItem);
  const updateRoadmapItem = useManageStore((state) => state.updateRoadmapItem);
  const deleteRoadmapItem = useManageStore((state) => state.deleteRoadmapItem);
  const addWeekToRoadmap = useManageStore((state) => state.addWeekToRoadmap);
  const addSubTopicToWeek = useManageStore((state) => state.addSubTopicToWeek);
  const toggleSubTopicComplete = useManageStore(
    (state) => state.toggleSubTopicComplete
  );
  const deleteSubTopic = useManageStore((state) => state.deleteSubTopic);
  const setCurrentWeek = useManageStore((state) => state.setCurrentWeek);
  const markWeekPassed = useManageStore((state) => state.markWeekPassed);
  const addClassMaterial = useManageStore((state) => state.addClassMaterial);
  const updateClassMaterial = useManageStore(
    (state) => state.updateClassMaterial
  );
  const deleteClassMaterial = useManageStore(
    (state) => state.deleteClassMaterial
  );
  const addProgram = useManageStore((state) => state.addProgram);
  const updateProgram = useManageStore((state) => state.updateProgram);
  const deleteProgram = useManageStore((state) => state.deleteProgram);
  const addMilestoneToProgram = useManageStore(
    (state) => state.addMilestoneToProgram
  );
  const adminToggleMilestoneComplete = useManageStore(
    (state) => state.adminToggleMilestoneComplete
  );
  const approveJoinRequest = useManageStore(
    (state) => state.approveJoinRequest
  );
  const rejectJoinRequest = useManageStore((state) => state.rejectJoinRequest);
  const approveSession = useManageStore((state) => state.approveSession);
  const rejectSession = useManageStore((state) => state.rejectSession);
  const startSession = useManageStore((state) => state.startSession);
  const updateSession = useManageStore((state) => state.updateSession);
  const deleteSession = useManageStore((state) => state.deleteSession);
  const adminUser = { id: 2, name: "Admin" };
  // Debug log - Reduced dependencies to prevent potential loops
  useEffect(() => {
    console.log("Administrator - State Update");
    console.log("Announcements:", announcements.length);
    console.log("Assignments:", assignments.length);
    console.log("Exercises:", exercises.length);
    console.log("Projects:", projects.length);
    console.log("Attendance:", attendance.length);
    console.log("Roadmap Items:", roadmapItems.length);
    console.log("Class Materials:", classMaterials.length);
    console.log("Programs:", programs.length);
  }, [
    announcements.length,
    assignments.length,
    exercises.length,
    projects.length,
    attendance.length,
    roadmapItems.length,
    classMaterials.length,
    programs.length,
  ]);
  const students = useMemo(
    () => directory.filter((u) => u.role === "Student"),
    [directory]
  );
  const recentStudents = useMemo(
    () =>
      students.slice(0, 5).map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        cohort: student.cohort,
        status: "active",
        attendance: student.attendance || 0,
      })),
    [students]
  );
  const stats = [
    {
      label: "Total Students",
      value: studentCount.toString(),
      icon: Users,
      color: "yellow",
    },
    { label: "Active Courses", value: "8", icon: BookOpen, color: "blue" },
  ];
  const pendingActions = useMemo(
    () => [
      ...assignments
        .filter((assignment) => assignment.status === "submitted")
        .map((assignment) => ({
          id: `assignment-${assignment.id}`,
          type: "Assignment Review",
          student:
            recentStudents.find((s) => s.id === assignment.studentId)?.name ||
            "Unknown",
          description: assignment.title,
          priority: "medium",
        })),
      ...exercises
        .filter((exercise) => exercise.status === "submitted")
        .map((exercise) => ({
          id: `exercise-${exercise.id}`,
          type: "Exercise Review",
          student:
            recentStudents.find((s) => s.id === exercise.studentId)?.name ||
            "Unknown",
          description: exercise.title,
          priority: "medium",
        })),
      ...projects
        .filter((project) => project.status === "submitted")
        .map((project) => ({
          id: `project-${project.id}`,
          type: "Project Review",
          student:
            recentStudents.find((s) => s.id === project.studentId)?.name ||
            "Unknown",
          description: project.title,
          priority: "medium",
        })),
    ],
    [assignments, exercises, projects, recentStudents]
  );
  // Filtered data for tabs
  const filteredAssignments = useMemo(
    () =>
      assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recentStudents
            .find((s) => s.id === a.studentId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [assignments, searchTerm, recentStudents]
  );
  const filteredExercises = useMemo(
    () =>
      exercises.filter(
        (e) =>
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recentStudents
            .find((s) => s.id === e.studentId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [exercises, searchTerm, recentStudents]
  );
  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recentStudents
            .find((s) => s.id === p.studentId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [projects, searchTerm, recentStudents]
  );
  const filteredAttendance = useMemo(
    () =>
      attendance.filter(
        (a) =>
          a.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recentStudents
            .find((s) => s.id === a.studentId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [attendance, searchTerm, recentStudents]
  );
  const filteredRoadmapItems = useMemo(
    () =>
      roadmapItems.filter(
        (r) =>
          r.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.term.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [roadmapItems, searchTerm]
  );
  const filteredClassMaterials = useMemo(
    () =>
      classMaterials.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [classMaterials, searchTerm]
  );
  const filteredPrograms = useMemo(
    () =>
      programs.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [programs, searchTerm]
  );
  const StatIcon = ({ icon: IconComponent, color }) => (
    <IconComponent
      className={`w-8 h-8 ${
        color === "yellow"
          ? "text-yellow-500"
          : color === "blue"
          ? "text-blue-500"
          : color === "green"
          ? "text-green-500"
          : "text-purple-500"
      }`}
    />
  );
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = (arr) =>
      arr.length ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
    switch (selectedForm) {
      case "announcement": {
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const now = new Date();
        const newAnnouncement = {
          id: newId(announcements),
          title: formData.title,
          content: formData.content,
          date: now.toISOString().split("T")[0],
          time: now.toTimeString().split(" ")[0].slice(0, 5),
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
        };
        addAnnouncement(newAnnouncement);
        alert("Announcement added successfully!");
        break;
      }
      case "announcement-edit": {
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const announcement = announcements.find((a) => a.id === formData.id);
        updateAnnouncement(formData.id, {
          title: formData.title,
          content: formData.content,
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
          date: announcement.date,
          time: announcement.time,
        });
        alert("Announcement updated successfully!");
        break;
      }
      case "event": {
        if (!formData.event || !formData.date || !formData.time) {
          alert("Please fill in all required fields (Event, Date, and Time).");
          return;
        }
        if (formData.id) {
          updateEvent(formData.id, {
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
          alert("Event updated successfully!");
        } else {
          addEvent({
            id: newId(events),
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
          alert("Event added successfully!");
        }
        break;
      }
      case "assignment": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newAssignment = {
          id: newId(assignments),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addAssignment(newAssignment);
        alert("Assignment added successfully! Student will see it now.");
        break;
      }
      case "assignment-edit": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateAssignment(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Assignment updated successfully!");
        break;
      }
      case "exercise": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newExercise = {
          id: newId(exercises),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addExercise(newExercise);
        alert("Exercise added successfully! Student will see it now.");
        break;
      }
      case "exercise-edit": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateExercise(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Exercise updated successfully!");
        break;
      }
      case "project": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newProject = {
          id: newId(projects),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addProject(newProject);
        alert("Project added successfully! Student will see it now.");
        break;
      }
      case "project-edit": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateProject(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Project updated successfully!");
        break;
      }
      case "attendance": {
        if (
          !formData.date ||
          !formData.status ||
          !formData.topic ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const newAttendance = {
          id: newId(attendance),
          date: formData.date,
          status: formData.status,
          topic: formData.topic,
          studentId: parseInt(formData.studentId),
        };
        addAttendance(newAttendance);
        alert("Attendance record added successfully! Student will see it now.");
        break;
      }
      case "attendance-edit": {
        if (
          !formData.date ||
          !formData.status ||
          !formData.topic ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        updateAttendance(formData.id, {
          date: formData.date,
          status: formData.status,
          topic: formData.topic,
          studentId: parseInt(formData.studentId),
        });
        alert("Attendance record updated successfully!");
        break;
      }
      case "roadmap": {
        if (!formData.phase || !formData.term || !formData.status) {
          alert("Please fill in all required fields (Phase, Term, Status).");
          return;
        }
        const newRoadmapItem = {
          id: newId(roadmapItems),
          phase: formData.phase,
          term: formData.term,
          status: formData.status,
          weeks: [],
        };
        addRoadmapItem(newRoadmapItem);
        alert("Roadmap item added successfully!");
        break;
      }
      case "roadmap-edit": {
        if (!formData.phase || !formData.term || !formData.status) {
          alert("Please fill in all required fields (Phase, Term, Status).");
          return;
        }
        updateRoadmapItem(formData.id, {
          phase: formData.phase,
          term: formData.term,
          status: formData.status,
        });
        alert("Roadmap item updated successfully!");
        break;
      }
      case "week": {
        if (!formData.roadmapId || !formData.weekNumber || !formData.topic) {
          alert(
            "Please fill in all required fields (Roadmap ID, Week Number, Topic)."
          );
          return;
        }
        const weekNumber = parseInt(formData.weekNumber);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          alert("Please enter a valid week number.");
          return;
        }
        addWeekToRoadmap(
          parseInt(formData.roadmapId),
          weekNumber,
          formData.topic
        );
        alert("Week added successfully!");
        break;
      }
      case "subtopic": {
        if (
          !formData.roadmapId ||
          !formData.weekIndex ||
          !formData.subTopicName
        ) {
          alert(
            "Please fill in all required fields (Roadmap ID, Week Index, Subtopic Name)."
          );
          return;
        }
        const weekIndex = parseInt(formData.weekIndex);
        if (isNaN(weekIndex) || weekIndex < 0) {
          alert("Please enter a valid week index.");
          return;
        }
        addSubTopicToWeek(
          parseInt(formData.roadmapId),
          weekIndex,
          formData.subTopicName
        );
        alert("Subtopic added successfully!");
        break;
      }
      case "classmaterial":
      case "classmaterial-edit": {
        if (
          !formData.title ||
          !formData.week ||
          !formData.resources ||
          !formData.topics
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const weekNum = parseInt(formData.week);
        const resourcesNum = parseInt(formData.resources);
        if (
          isNaN(weekNum) ||
          weekNum <= 0 ||
          isNaN(resourcesNum) ||
          resourcesNum <= 0
        ) {
          alert("Please enter valid numbers for week and resources.");
          return;
        }
        const topics = formData.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        if (topics.length === 0) {
          alert("Please enter at least one topic.");
          return;
        }
        const materialData = {
          title: formData.title,
          week: weekNum,
          resources: resourcesNum,
          topics,
          files: [], // Placeholder for files; can be extended later
        };
        if (selectedForm === "classmaterial") {
          const newMaterial = {
            id: newId(classMaterials),
            ...materialData,
          };
          addClassMaterial(newMaterial);
          alert("Class material added successfully! Student will see it now.");
        } else {
          updateClassMaterial(formData.id, materialData);
          alert("Class material updated successfully!");
        }
        break;
      }
      case "program":
      case "program-edit": {
        if (
          !formData.name ||
          !formData.description ||
          !formData.totalMilestones
        ) {
          alert(
            "Please fill in all required fields (Name, Description, Total Milestones)."
          );
          return;
        }
        const totalMilestones = parseInt(formData.totalMilestones);
        if (isNaN(totalMilestones) || totalMilestones <= 0) {
          alert("Please enter a valid number number for total milestones.");
          return;
        }
        if (selectedForm === "program") {
          const newProgram = {
            id: newId(programs),
            name: formData.name,
            description: formData.description,
            totalMilestones,
            milestones: [],
            pendingRequests: [],
            enrolledStudents: [],
          };
          addProgram(newProgram);
          alert("Program added successfully!");
        } else {
          updateProgram(formData.id, {
            name: formData.name,
            description: formData.description,
            totalMilestones,
          });
          alert("Program updated successfully!");
        }
        break;
      }
      case "milestone": {
        if (!formData.programId || !formData.milestoneName) {
          alert(
            "Please fill in all required fields (Program ID and Milestone Name)."
          );
          return;
        }
        const programId = parseInt(formData.programId);
        const program = programs.find((p) => p.id === programId);
        if (!program) {
          alert("Program not found.");
          return;
        }
        if (program.milestones.length >= program.totalMilestones) {
          alert("Maximum milestones reached for this program.");
          return;
        }
        addMilestoneToProgram(programId, formData.milestoneName);
        alert("Milestone added successfully!");
        break;
      }
      default:
        break;
    }
    setFormData({});
    setSelectedForm("");
  };
  const uploadToCloudinary = async (file) => {
    const cloudName = "dpttonwcs";
    const uploadPreset = "Julius";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };
  const handleAdminImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    try {
      // Upload file to backend (which handles Cloudinary)
      const { url } = await uploadsAPI.uploadFile(file);
      
      // Update user profile with the image URL
      const updatedUser = await usersAPI.updateProfile({ profileImage: url });
      
      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedCurrentUser = { ...currentUser, ...updatedUser, profileImage: url };
      localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      
      // Also update the local store for immediate UI update
      const currentUserId = currentUser.id || currentUser._id;
      if (currentUserId) {
        updateUser(currentUserId, { pictureUrl: url, profileImage: url });
      }
      
      // Update admin profile state immediately
      const profileData = {
        ...updatedUser,
        pictureUrl: updatedUser.profileImage || url,
        id: updatedUser.id || updatedUser._id,
        _id: updatedUser.id || updatedUser._id,
      };
      setAdminProfile(profileData);
      
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert(error.response?.data?.message || "Failed to upload image. Please try again.");
    }
    
    e.target.value = "";
  };
  const handleEditEvent = (event) => {
    setFormData({
      id: event.id,
      event: event.event,
      date: event.date,
      time: event.time,
    });
    setSelectedForm("event");
  };
  const handleEditAnnouncement = (announcement) => {
    setFormData({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      author: announcement.author,
    });
    setSelectedForm("announcement-edit");
  };
  const getFormTitle = (formType, hasId) => {
    const titles = {
      announcement: "New Announcement",
      "announcement-edit": "Edit Announcement",
      assignment: "New Assignment",
      "assignment-edit": "Edit Assignment",
      exercise: "New Exercise",
      "exercise-edit": "Edit Exercise",
      project: "New Project",
      "project-edit": "Edit Project",
      event: hasId ? "Edit Event" : "New Event",
      attendance: "New Attendance",
      "attendance-edit": "Edit Attendance",
      roadmap: "New Roadmap Item",
      "roadmap-edit": "Edit Roadmap Item",
      week: "New Week",
      subtopic: "New Subtopic",
      classmaterial: "New Class Material",
      "classmaterial-edit": "Edit Class Material",
      program: "New Program",
      "program-edit": "Edit Program",
      milestone: "New Milestone",
    };
    return titles[formType] || "Edit Item";
  };
  const renderForm = () => {
    switch (selectedForm) {
      case "announcement":
      case "announcement-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Content *
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => handleFormChange("content", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Priority
              </label>
              <select
                value={formData.priority || "medium"}
                onChange={(e) => handleFormChange("priority", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Author</label>
              <input
                type="text"
                value={formData.author || "Admin Team"}
                onChange={(e) => handleFormChange("author", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "assignment":
      case "assignment-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "exercise":
      case "exercise-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "project":
      case "project-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "event":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Event *
              </label>
              <input
                type="text"
                value={formData.event || ""}
                onChange={(e) => handleFormChange("event", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date *</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Time *</label>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => handleFormChange("time", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "attendance":
      case "attendance-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date *</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic || ""}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Status *
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "roadmap":
      case "roadmap-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Phase *
              </label>
              <input
                type="text"
                placeholder="e.g., First_Term"
                value={formData.phase || ""}
                onChange={(e) => handleFormChange("phase", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Term (no. of weeks) *
              </label>
              <input
                type="text"
                placeholder="e.g., 13-weeks"
                value={formData.term || ""}
                onChange={(e) => handleFormChange("term", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Status *
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        );
      case "week":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Roadmap ID *
              </label>
              <input
                type="number"
                value={formData.roadmapId || ""}
                onChange={(e) => handleFormChange("roadmapId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the roadmap to add the week to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Week Number *
              </label>
              <input
                type="number"
                value={formData.weekNumber || ""}
                onChange={(e) => handleFormChange("weekNumber", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic || ""}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "subtopic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Roadmap ID *
              </label>
              <input
                type="number"
                value={formData.roadmapId || ""}
                onChange={(e) => handleFormChange("roadmapId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the roadmap containing the week.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Week Index *
              </label>
              <input
                type="number"
                value={formData.weekIndex || ""}
                onChange={(e) => handleFormChange("weekIndex", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the index of the week (0-based) to add the subtopic to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Subtopic Name *
              </label>
              <input
                type="text"
                value={formData.subTopicName || ""}
                onChange={(e) =>
                  handleFormChange("subTopicName", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "classmaterial":
      case "classmaterial-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Week *</label>
              <input
                type="number"
                value={formData.week || ""}
                onChange={(e) => handleFormChange("week", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Number of Resources *
              </label>
              <input
                type="number"
                value={formData.resources || ""}
                onChange={(e) => handleFormChange("resources", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topics (comma separated) *
              </label>
              <textarea
                value={formData.topics || ""}
                onChange={(e) => handleFormChange("topics", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="3"
                placeholder="e.g., JavaScript Basics, React Components"
                required
              />
            </div>
          </div>
        );
      case "program":
      case "program-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Total Milestones *
              </label>
              <input
                type="number"
                value={formData.totalMilestones || ""}
                onChange={(e) =>
                  handleFormChange("totalMilestones", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
                placeholder="e.g., 5"
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the total number of milestones for this program.
              </p>
            </div>
          </div>
        );
      case "milestone":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Program ID *
              </label>
              <input
                type="number"
                value={formData.programId || ""}
                onChange={(e) => handleFormChange("programId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the program to add the milestone to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Milestone Name *
              </label>
              <input
                type="text"
                value={formData.milestoneName || ""}
                onChange={(e) =>
                  handleFormChange("milestoneName", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // 100 Days To BECE logic
  const daysOfLearning = useManageStore((state) => state.daysOfLearning);
  const updateDaysOfLearning = useManageStore(
    (state) => state.updateDaysOfLearning
  );
  const todayStr = new Date().toISOString().split("T")[0];
  const isTodayCompleted = daysOfLearning.lastCompletedDate === todayStr;
  const isChallengeCompleted =
    daysOfLearning.completedDays >= daysOfLearning.totalDays;
  // Handlers from sub-components
  // From Administra
  const handleEditAssignment = (assignment) => {
    setFormData({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points,
      studentId: assignment.studentId,
    });
    setSelectedForm("assignment-edit");
  };
  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(assignmentId);
      alert("Assignment deleted successfully!");
    }
  };
  const handleEditExercise = (exercise) => {
    setFormData({
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      points: exercise.points,
      studentId: exercise.studentId,
    });
    setSelectedForm("exercise-edit");
  };
  const handleDeleteExercise = (exerciseId) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(exerciseId);
      alert("Exercise deleted successfully!");
    }
  };
  const handleEditProject = (project) => {
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      dueDate: project.dueDate,
      points: project.points,
      studentId: project.studentId,
    });
    setSelectedForm("project-edit");
  };
  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
      alert("Project deleted successfully!");
    }
  };
  const handleMarkSubmitted = (id, type) => {
    if (type === "assignment") {
      updateAssignment(id, { status: "submitted" });
      alert("Assignment marked as submitted!");
    } else if (type === "exercise") {
      updateExercise(id, { status: "submitted" });
      alert("Exercise marked as submitted!");
    } else if (type === "project") {
      updateProject(id, { status: "submitted" });
      alert("Project marked as submitted!");
    }
  };
  const handleGradeChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleGradeSubmit = (id, type) => {
    const grade = parseFloat(formData[id]);
    let item;
    let points;
    if (type === "assignment") {
      item = assignments.find((a) => a.id === id);
      points = item.points;
      if (isNaN(grade) || grade < 0 || grade > points) {
        alert(`Please enter a valid grade between 0 and ${points} points.`);
        return;
      }
      updateAssignment(id, { status: "graded", grade });
    } else if (type === "exercise") {
      item = exercises.find((e) => e.id === id);
      points = item.points;
      if (isNaN(grade) || grade < 0 || grade > points) {
        alert(`Please enter a valid grade between 0 and ${points} points.`);
        return;
      }
      updateExercise(id, { status: "graded", grade });
    } else if (type === "project") {
      item = projects.find((p) => p.id === id);
      points = item.points;
      if (isNaN(grade) || grade < 0 || grade > points) {
        alert(`Please enter a valid grade between 0 and ${points} points.`);
        return;
      }
      updateProject(id, { status: "graded", grade });
    }
    setFormData((prev) => ({ ...prev, [id]: "" }));
    alert("Grade submitted successfully!");
  };
  // From Adminis
  const handleEditAttendance = (record) => {
    setFormData({
      id: record.id,
      date: record.date,
      status: record.status,
      topic: record.topic,
      studentId: record.studentId,
    });
    setSelectedForm("attendance-edit");
  };
  const handleDeleteAttendance = (attendanceId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      deleteAttendance(attendanceId);
      alert("Attendance record deleted successfully!");
    }
  };
  const handleEditRoadmapItem = (roadmapItem) => {
    setFormData({
      id: roadmapItem.id,
      phase: roadmapItem.phase,
      term: roadmapItem.term,
      status: roadmapItem.status,
    });
    setSelectedForm("roadmap-edit");
  };
  const handleSetCurrentWeekLocal = (roadmapId, weekIndex) => {
    setCurrentWeek(roadmapId, weekIndex);
    alert("Current week set successfully!");
  };
  const handleToggleSubTopicCompleteLocal = (
    roadmapId,
    weekIndex,
    subTopicId
  ) => {
    toggleSubTopicComplete(roadmapId, weekIndex, subTopicId);
    alert("Subtopic completion status toggled!");
  };
  const handleDeleteSubTopicLocal = (roadmapId, weekIndex, subTopicId) => {
    if (window.confirm("Are you sure you want to delete this subtopic?")) {
      deleteSubTopic(roadmapId, weekIndex, subTopicId);
      alert("Subtopic deleted successfully!");
    }
  };
  const handleDeleteRoadmapItemLocal = (roadmapId) => {
    if (window.confirm("Are you sure you want to delete this roadmap item?")) {
      deleteRoadmapItem(roadmapId);
      alert("Roadmap item deleted successfully!");
    }
  };
  const handleEditClassMaterial = (material) => {
    setFormData({
      id: material.id,
      title: material.title,
      week: material.week,
      resources: material.resources,
      topics: material.topics.join(", "),
    });
    setSelectedForm("classmaterial-edit");
  };
  const handleDeleteClassMaterial = (materialId) => {
    if (
      window.confirm("Are you sure you want to delete this class material?")
    ) {
      deleteClassMaterial(materialId);
      alert("Class material deleted successfully!");
    }
  };
  const handleEditProgram = (program) => {
    setFormData({
      id: program.id,
      name: program.name,
      description: program.description,
      totalMilestones: program.totalMilestones,
    });
    setSelectedForm("program-edit");
  };
  const handleDeleteProgram = (programId) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      deleteProgram(programId);
      alert("Program deleted successfully!");
    }
  };
  const handleAdminToggleMilestone = (programId, milestoneId) => {
    adminToggleMilestoneComplete(programId, milestoneId);
    alert("Milestone completion status updated!");
  };
  const handleApproveJoin = (programId) => {
    approveJoinRequest(programId, 1);
    alert("Join request approved!");
  };
  const handleRejectJoin = (programId) => {
    rejectJoinRequest(programId, 1);
    alert("Join request rejected!");
  };
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">
            Administrator Panel - Team Size: {studentCount}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBellClick}
              className="relative text-gray-400 hover:text-white"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                {
                  useManageStore
                    .getState()
                    .notifications.filter((n) => n.userId === userId && !n.read)
                    .length
                }
              </span>
            </button>
            <div className="relative group">
              {adminProfile?.pictureUrl ? (
                <img
                  src={adminProfile.pictureUrl}
                  alt="Admin Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAdminImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-white text-xs">Upload Photo</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="space-y-6 p-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold">
              Administrator Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Manage students, assignments, exercises, roadmap, and system
              settings
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
            <select
              value={selectedForm}
              onChange={(e) => {
                setSelectedForm(e.target.value);
                setFormData({});
              }}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Select Content Type</option>
              <option value="announcement">New Announcement</option>
              <option value="assignment">New Assignment</option>
              <option value="exercise">New Exercise</option>
              <option value="project">New Project</option>
              <option value="event">New Event</option>
              <option value="attendance">New Attendance</option>
              <option value="roadmap">New Roadmap Item</option>
              <option value="week">New Week</option>
              <option value="subtopic">New Subtopic</option>
              <option value="classmaterial">New Class Material</option>
              <option value="program">New Program</option>
              <option value="milestone">New Milestone</option>
            </select>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`${showSettings ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-gray-800 hover:bg-gray-700 text-white'} px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2 font-semibold`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {selectedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-2xl font-bold">
                  {getFormTitle(selectedForm, !!formData.id)}
                </h2>
                <button
                  onClick={() => {
                    setSelectedForm("");
                    setFormData({});
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                {renderForm()}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedForm("");
                      setFormData({});
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <StatIcon icon={stat.icon} color={stat.color} />
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-white text-3xl font-bold mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "announcements"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "assignments"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "exercises"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "projects"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "attendance"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "roadmap"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setActiveTab("classmaterials")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "classmaterials"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Class Materials
            </button>
            <button
              onClick={() => setActiveTab("programs")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                activeTab === "programs"
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Programs
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <span>Upcoming Events</span>
                </h3>
                <div className="space-y-3">
                  {events.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No events scheduled
                    </p>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-semibold">
                              {event.event}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {event.date} at {event.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="text-yellow-500 hover:text-yellow-400"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedForm("event");
                    setFormData({});
                  }}
                  className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Add Event
                </button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-yellow-500" />
                  <span>Pending Actions</span>
                </h3>
                {pendingActions.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No pending actions
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingActions.map((action) => (
                      <div
                        key={action.id}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                      >
                        <p className="text-white font-semibold">
                          {action.type}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {action.student} - {action.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "announcements" && (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                <span>Announcements</span>
              </h3>
              {announcements.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">
                    No announcements available
                  </p>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">
                          {announcement.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {announcement.content}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {announcement.date} at {announcement.time} by{" "}
                          {announcement.author}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditAnnouncement(announcement)}
                          className="text-yellow-500 hover:text-yellow-400"
                          title="Edit Announcement"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete Announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={() => {
                  setSelectedForm("announcement");
                  setFormData({});
                }}
                className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Add Announcement
              </button>
            </div>
          )}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold">
                  All Assignments
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("assignment");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Assignment
                </button>
              </div>
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredAssignments.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">No assignments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {assignment.title}
                          </h4>
                          {assignment.description && (
                            <p className="text-gray-400 text-sm mb-3">
                              {assignment.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              Due: {assignment.dueDate}
                            </span>
                            <span className="text-gray-400">
                              {assignment.points} points
                            </span>
                            <span className="text-gray-400">
                              Student:{" "}
                              {
                                recentStudents.find(
                                  (s) => s.id === assignment.studentId
                                )?.name
                              }
                            </span>
                          </div>
                          {assignment.createdDate && assignment.createdTime && (
                            <p className="text-gray-500 text-xs mt-2">
                              Created: {assignment.createdDate} at{" "}
                              {assignment.createdTime}
                            </p>
                          )}
                          {assignment.status === "pending" && (
                            <div className="mt-4 flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  handleMarkSubmitted(
                                    assignment.id,
                                    "assignment"
                                  )
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                              >
                                Mark as Submitted
                              </button>
                            </div>
                          )}
                          {assignment.status === "submitted" && (
                            <div className="mt-4 flex items-center space-x-3">
                              <input
                                type="number"
                                value={formData[assignment.id] || ""}
                                onChange={(e) =>
                                  handleGradeChange(
                                    assignment.id,
                                    e.target.value
                                  )
                                }
                                className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                                placeholder="Grade"
                              />
                              <button
                                onClick={() =>
                                  handleGradeSubmit(assignment.id, "assignment")
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                              >
                                Submit Grade
                              </button>
                            </div>
                          )}
                          {assignment.status === "graded" && (
                            <div className="mt-3">
                              <p className="text-green-400 text-sm font-semibold">
                                Graded: {assignment.grade}/{assignment.points}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              assignment.status === "graded"
                                ? "bg-green-500 text-white"
                                : assignment.status === "submitted"
                                ? "bg-blue-500 text-white"
                                : "bg-yellow-500 text-gray-900"
                            }`}
                          >
                            {assignment.status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="text-yellow-500 hover:text-yellow-400"
                            title="Edit Assignment"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAssignment(assignment.id)
                            }
                            className="text-red-500 hover:text-red-400"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "exercises" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5 text-yellow-500" />
                  <span>All Exercises</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("exercise");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Exercise
                </button>
              </div>
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredExercises.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">No exercises yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {exercise.title}
                          </h4>
                          {exercise.description && (
                            <p className="text-gray-400 text-sm mb-3">
                              {exercise.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              {exercise.points} points
                            </span>
                            <span className="text-gray-400">
                              Student:{" "}
                              {
                                recentStudents.find(
                                  (s) => s.id === exercise.studentId
                                )?.name
                              }
                            </span>
                          </div>
                          {exercise.createdDate && exercise.createdTime && (
                            <p className="text-gray-500 text-xs mt-2">
                              Created: {exercise.createdDate} at{" "}
                              {exercise.createdTime}
                            </p>
                          )}
                          {exercise.status === "pending" && (
                            <div className="mt-4 flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  handleMarkSubmitted(exercise.id, "exercise")
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                              >
                                Mark as Submitted
                              </button>
                            </div>
                          )}
                          {exercise.status === "submitted" && (
                            <div className="mt-4 flex items-center space-x-3">
                              <input
                                type="number"
                                value={formData[exercise.id] || ""}
                                onChange={(e) =>
                                  handleGradeChange(exercise.id, e.target.value)
                                }
                                className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                                placeholder="Grade"
                              />
                              <button
                                onClick={() =>
                                  handleGradeSubmit(exercise.id, "exercise")
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                              >
                                Submit Grade
                              </button>
                            </div>
                          )}
                          {exercise.status === "graded" && (
                            <div className="mt-3">
                              <p className="text-green-400 text-sm font-semibold">
                                Graded: {exercise.grade}/{exercise.points}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              exercise.status === "graded"
                                ? "bg-green-500 text-white"
                                : exercise.status === "submitted"
                                ? "bg-blue-500 text-white"
                                : "bg-yellow-500 text-gray-900"
                            }`}
                          >
                            {exercise.status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleEditExercise(exercise)}
                            className="text-yellow-500 hover:text-yellow-400"
                            title="Edit Exercise"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="text-red-500 hover:text-red-400"
                            title="Delete Exercise"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-yellow-500" />
                  <span>All Projects</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("project");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Project
                </button>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredProjects.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">No projects yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {project.title}
                          </h4>
                          {project.description && (
                            <p className="text-gray-400 text-sm mb-3">
                              {project.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              Due: {project.dueDate}
                            </span>
                            <span className="text-gray-400">
                              {project.points} points
                            </span>
                            <span className="text-gray-400">
                              Student:{" "}
                              {
                                recentStudents.find(
                                  (s) => s.id === project.studentId
                                )?.name
                              }
                            </span>
                          </div>
                          {project.createdDate && project.createdTime && (
                            <p className="text-gray-500 text-xs mt-2">
                              Created: {project.createdDate} at{" "}
                              {project.createdTime}
                            </p>
                          )}
                          {project.status === "pending" && (
                            <div className="mt-4 flex items-center space-x-3">
                              <button
                                onClick={() =>
                                  handleMarkSubmitted(project.id, "project")
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                              >
                                Mark as Submitted
                              </button>
                            </div>
                          )}
                          {project.status === "submitted" && (
                            <div className="mt-4 flex items-center space-x-3">
                              <input
                                type="number"
                                value={formData[project.id] || ""}
                                onChange={(e) =>
                                  handleGradeChange(project.id, e.target.value)
                                }
                                className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                                placeholder="Grade"
                              />
                              <button
                                onClick={() =>
                                  handleGradeSubmit(project.id, "project")
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                              >
                                Submit Grade
                              </button>
                            </div>
                          )}
                          {project.status === "graded" && (
                            <div className="mt-3">
                              <p className="text-green-400 text-sm font-semibold">
                                Graded: {project.grade}/{project.points}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              project.status === "graded"
                                ? "bg-green-500 text-white"
                                : project.status === "submitted"
                                ? "bg-blue-500 text-white"
                                : "bg-yellow-500 text-gray-900"
                            }`}
                          >
                            {project.status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-yellow-500 hover:text-yellow-400"
                            title="Edit Project"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-500 hover:text-red-400"
                            title="Delete Project"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-yellow-500" />
                  <span>All Attendance Records</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("attendance");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Attendance
                </button>
              </div>
              <input
                type="text"
                placeholder="Search attendance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredAttendance.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">
                    No attendance records yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAttendance.map((record) => (
                    <div
                      key={record.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {record.topic}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">
                              Date: {record.date}
                            </span>
                            <span className="text-gray-400">
                              Student:{" "}
                              {
                                recentStudents.find(
                                  (s) => s.id === record.studentId
                                )?.name
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === "present"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {record.status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => handleEditAttendance(record)}
                            className="text-yellow-500 hover:text-yellow-400"
                            title="Edit Attendance"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAttendance(record.id)}
                            className="text-red-500 hover:text-red-400"
                            title="Delete Attendance"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "roadmap" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                  <Map className="w-5 h-5 text-yellow-500" />
                  <span>All Roadmap Items</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("roadmap");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Roadmap Item
                </button>
              </div>
              <input
                type="text"
                placeholder="Search roadmap items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredRoadmapItems.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">No roadmap items yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRoadmapItems.map((roadmap) => (
                    <div
                      key={roadmap.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {roadmap.phase} - {roadmap.term}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                roadmap.status === "completed"
                                  ? "bg-green-500 text-white"
                                  : roadmap.status === "in-progress"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {roadmap.status.toUpperCase()}
                            </span>
                          </div>
                          {roadmap.weeks && roadmap.weeks.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <h5 className="text-gray-400 text-sm font-semibold">
                                Weeks:
                              </h5>
                              {roadmap.weeks.map((week, weekIndex) => (
                                <div
                                  key={weekIndex}
                                  className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="text-white font-semibold">
                                      Week {week.weekNumber}: {week.topic}
                                    </h6>
                                    <button
                                      onClick={() =>
                                        handleSetCurrentWeekLocal(
                                          roadmap.id,
                                          weekIndex
                                        )
                                      }
                                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                        week.current
                                          ? "bg-yellow-500 text-gray-900"
                                          : "bg-gray-700 text-white hover:bg-gray-600"
                                      }`}
                                    >
                                      {week.current
                                        ? "Current Week"
                                        : "Set as Current"}
                                    </button>
                                  </div>
                                  {week.subTopics &&
                                    week.subTopics.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        {week.subTopics.map((subTopic) => (
                                          <div
                                            key={subTopic.id}
                                            className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                                          >
                                            <div className="flex items-center space-x-3">
                                              <input
                                                type="checkbox"
                                                checked={subTopic.completed}
                                                onChange={() =>
                                                  handleToggleSubTopicCompleteLocal(
                                                    roadmap.id,
                                                    weekIndex,
                                                    subTopic.id
                                                  )
                                                }
                                                className="w-4 h-4"
                                              />
                                              <span
                                                className={`text-sm ${
                                                  subTopic.completed
                                                    ? "text-gray-500 line-through"
                                                    : "text-white"
                                                }`}
                                              >
                                                {subTopic.name}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() =>
                                                handleDeleteSubTopicLocal(
                                                  roadmap.id,
                                                  weekIndex,
                                                  subTopic.id
                                                )
                                              }
                                              className="text-red-500 hover:text-red-400"
                                              title="Delete Subtopic"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  <button
                                    onClick={() => {
                                      setSelectedForm("subtopic");
                                      setFormData({
                                        roadmapId: roadmap.id,
                                        weekIndex,
                                      });
                                    }}
                                    className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                                  >
                                    Add Subtopic
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  setSelectedForm("week");
                                  setFormData({ roadmapId: roadmap.id });
                                }}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                              >
                                Add Week
                              </button>
                            </div>
                          )}
                          {(!roadmap.weeks || roadmap.weeks.length === 0) && (
                            <button
                              onClick={() => {
                                setSelectedForm("week");
                                setFormData({ roadmapId: roadmap.id });
                              }}
                              className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                              Add First Week
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <button
                            onClick={() => handleEditRoadmapItem(roadmap)}
                            className="text-yellow-500 hover:text-yellow-400"
                            title="Edit Roadmap Item"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteRoadmapItemLocal(roadmap.id)
                            }
                            className="text-red-500 hover:text-red-400"
                            title="Delete Roadmap Item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "classmaterials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  <span>All Class Materials</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("classmaterial");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Class Material
                </button>
              </div>
              <input
                type="text"
                placeholder="Search class materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredClassMaterials.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">
                    No class materials yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClassMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <BookOpen className="w-6 h-6 text-yellow-500" />
                            <h4 className="text-white font-semibold text-lg">
                              {material.title}
                            </h4>
                          </div>
                          <span className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                            Week {material.week}
                          </span>
                          <span className="ml-2 inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                            {material.resources} resources
                          </span>
                          <div className="space-y-2 mt-4">
                            <p className="text-gray-400 text-sm font-semibold mb-2">
                              Topics Covered:
                            </p>
                            {material.topics.map((topic, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 text-gray-300"
                              >
                                <CheckCircle className="w-4 h-4 text-yellow-500" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                          {material.files && material.files.length > 0 && (
                            <div className="border-t border-gray-700 pt-4 mt-4">
                              <p className="text-gray-400 text-sm font-semibold mb-3">
                                Downloadable Files:
                              </p>
                              <div className="space-y-2">
                                {material.files.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                                        <span className="text-gray-900 text-xs font-bold">
                                          {file.type}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-white font-medium">
                                          {file.name}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                          {file.size}
                                        </p>
                                      </div>
                                    </div>
                                    <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
                                      <Download className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <button
                            onClick={() => handleEditClassMaterial(material)}
                            className="text-yellow-500 hover:text-yellow-400"
                            title="Edit Class Material"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteClassMaterial(material.id)
                            }
                            className="text-red-500 hover:text-red-400"
                            title="Delete Class Material"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "programs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-yellow-500" />
                  <span>All Programs</span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedForm("program");
                    setFormData({});
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                >
                  New Program
                </button>
              </div>
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
              {filteredPrograms.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400 text-lg">No programs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPrograms.map((program) => {
                    const completedMilestones =
                      program.milestones?.filter((m) => m.completed).length ||
                      0;
                    const total = program.totalMilestones || 0;
                    const progress =
                      total > 0
                        ? ((completedMilestones / total) * 100).toFixed(0)
                        : 0;
                    return (
                      <div
                        key={program.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg mb-2">
                              {program.name}
                            </h4>
                            <p className="text-gray-400 text-sm mb-3">
                              {program.description}
                            </p>
                            <div className="mb-3">
                              <p className="text-gray-400 text-sm mb-2">
                                Progress: {completedMilestones}/{total} (
                                {progress}
                                %)
                              </p>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                            {program.pendingRequests &&
                              program.pendingRequests.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-gray-400 text-sm font-semibold mb-2">
                                    Pending Join Requests:
                                  </p>
                                  <div className="space-y-2">
                                    {program.pendingRequests.map(
                                      (studentId) => (
                                        <div
                                          key={studentId}
                                          className="flex items-center justify-between bg-yellow-900 p-2 rounded"
                                        >
                                          <span className="text-yellow-300 text-sm">
                                            Julius Dagana (ID: {studentId})
                                          </span>
                                          <div className="space-x-2">
                                            <button
                                              onClick={() =>
                                                handleApproveJoin(program.id)
                                              }
                                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                              Approve
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleRejectJoin(program.id)
                                              }
                                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                              Reject
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            {program.enrolledStudents &&
                              program.enrolledStudents.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-gray-400 text-sm font-semibold mb-2">
                                    Enrolled Students:
                                  </p>
                                  <div className="space-y-1">
                                    {program.enrolledStudents.map(
                                      (studentId) => (
                                        <span
                                          key={studentId}
                                          className="inline-block bg-green-900 text-green-300 px-2 py-1 rounded text-xs"
                                        >
                                          Julius Dagana (ID: {studentId})
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            {program.milestones &&
                              program.milestones.length > 0 && (
                                <div className="mt-4 space-y-3">
                                  <h5 className="text-gray-400 text-sm font-semibold">
                                    Milestones:
                                  </h5>
                                  {program.milestones.map((milestone) => (
                                    <div
                                      key={milestone.id}
                                      className="bg-gray-900 rounded-lg p-3"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span
                                          className={`text-sm ${
                                            milestone.completed
                                              ? "text-green-400 line-through"
                                              : "text-white"
                                          }`}
                                        >
                                          {milestone.name}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            checked={milestone.completed}
                                            onChange={() =>
                                              handleAdminToggleMilestone(
                                                program.id,
                                                milestone.id
                                              )
                                            }
                                            className="w-4 h-4"
                                          />
                                          <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                              milestone.completed
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-500 text-white"
                                            }`}
                                          >
                                            {milestone.completed
                                              ? "Completed"
                                              : "Pending"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            {(!program.milestones ||
                              program.milestones.length === 0) && (
                              <button
                                onClick={() => {
                                  setSelectedForm("milestone");
                                  setFormData({ programId: program.id });
                                }}
                                className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                              >
                                Add First Milestone
                              </button>
                            )}
                            {program.milestones &&
                              program.milestones.length <
                                program.totalMilestones && (
                                <button
                                  onClick={() => {
                                    setSelectedForm("milestone");
                                    setFormData({ programId: program.id });
                                  }}
                                  className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                >
                                  Add Milestone
                                </button>
                              )}
                          </div>
                          <div className="flex items-center space-x-3 ml-4">
                            <button
                              onClick={() => handleEditProgram(program)}
                              className="text-yellow-500 hover:text-yellow-400"
                              title="Edit Program"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(program.id)}
                              className="text-red-500 hover:text-red-400"
                              title="Delete Program"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Additional sections outside tabs */}
          <SessionsManagement
            directory={directory}
            approveSession={approveSession}
            rejectSession={rejectSession}
            startSession={startSession}
            deleteSession={deleteSession}
          />
          <RoadmapManagement
            roadmapItems={roadmapItems}
            setCurrentWeek={setCurrentWeek}
            markWeekPassed={markWeekPassed}
          />
          {/* 100 Days To BECE Management */}
          <div className="mt-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              100 Days To BECE
            </h2>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg font-semibold">
                    Auto-Progress for Daily Readings
                  </h3>
                  <p className="text-gray-400">
                    Enable automatic daily completion and ticking of boxes
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateDaysOfLearning({ isActive: !daysOfLearning.isActive })
                  }
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    daysOfLearning.isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {daysOfLearning.isActive ? "Active" : "Inactive"}
                </button>
              </div>
              <div className="space-y-2 text-gray-400">
                <p>
                  Completed Days: {daysOfLearning.completedDays} of{" "}
                  {daysOfLearning.totalDays}
                </p>
                <p>
                  Last Completed:{" "}
                  {daysOfLearning.lastCompletedDate || "Not started"}
                </p>
                <p>Today's Status: {isTodayCompleted ? "Ticked" : "Pending"}</p>
              </div>
              <button
                onClick={() => {
                  if (isTodayCompleted) {
                    alert("Already ticked for today!");
                    return;
                  }
                  if (isChallengeCompleted) {
                    alert("Challenge completed!");
                    return;
                  }
                  updateDaysOfLearning({
                    completedDays: daysOfLearning.completedDays + 1,
                    lastCompletedDate: todayStr,
                    activities: [
                      ...daysOfLearning.activities,
                      {
                        day: daysOfLearning.completedDays + 1,
                        content: "Manually ticked by admin",
                        timestamp: new Date().toISOString(),
                      },
                    ],
                  });
                  alert("Day ticked successfully!");
                }}
                disabled={isTodayCompleted || isChallengeCompleted}
                className={`mt-4 px-4 py-2 rounded-lg font-semibold ${
                  isTodayCompleted || isChallengeCompleted
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                }`}
              >
                {isChallengeCompleted
                  ? "Challenge Completed"
                  : isTodayCompleted
                  ? "Already Ticked Today"
                  : "Manually Tick Next Day"}
              </button>
            </div>
          </div>
          {/* Social Connections Management */}
          <div className="mt-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              Social Connections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-4">
                  Pending Friend Requests
                </h3>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((req) => {
                    const fromUser = directory.find((u) => u.id === req.fromId);
                    return (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-3 bg-gray-700 rounded mb-3"
                      >
                        <div>
                          <p className="text-white">
                            {fromUser?.name || "Unknown"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {fromUser?.email}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => acceptFriendRequest(req.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectFriendRequest(req.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No pending friend requests.</p>
                )}
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-4">Friends</h3>
                {friendsForAdmin.length > 0 ? (
                  friendsForAdmin.map((friendId) => {
                    const friend = directory.find((u) => u.id === friendId);
                    return (
                      <div
                        key={friendId}
                        className="flex items-center justify-between p-3 bg-gray-700 rounded mb-3"
                      >
                        <div>
                          <p className="text-white">
                            {friend?.name || "Unknown"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {friend?.role}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUser(friend);
                            setIsChatOpen(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Chat
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No friends yet.</p>
                )}
              </div>
            </div>
          </div>
          {/* Students Directory with Pictures and Signup Details */}
          <div className="mt-8">
            <h2 className="text-white text-2xl font-bold mb-6">
              Students Directory
            </h2>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {students.length === 0 ? (
                <p className="text-gray-400 text-center">No students found.</p>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-start space-x-4 p-4 bg-gray-900 rounded-lg border border-gray-700"
                    >
                      <img
                        src={
                          student.pictureUrl ||
                          "https://via.placeholder.com/48?text=👤"
                        }
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">
                          {student.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          ID: {student.id}
                        </p>
                        <p className="text-gray-300 text-sm truncate">
                          {student.email}
                        </p>
                        {student.cohort && (
                          <p className="text-gray-500 text-xs">
                            Cohort: {student.cohort}
                          </p>
                        )}
                        {student.startDate && (
                          <p className="text-gray-500 text-xs">
                            Joined:{" "}
                            {new Date(student.startDate).toLocaleDateString()}
                          </p>
                        )}
                        {student.bio && (
                          <p className="text-gray-500 text-xs truncate mt-1">
                            Bio: {student.bio}
                          </p>
                        )}
                        {student.location && (
                          <p className="text-gray-500 text-xs">
                            Location: {student.location}
                          </p>
                        )}
                        {student.phone && (
                          <p className="text-gray-500 text-xs">
                            Phone: {student.phone}
                          </p>
                        )}
                        {student.github && (
                          <p className="text-gray-500 text-xs">
                            GitHub:{" "}
                            <a
                              href={`https://github.com/${student.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              @{student.github}
                            </a>
                          </p>
                        )}
                        {student.linkedin && (
                          <p className="text-gray-500 text-xs">
                            LinkedIn:{" "}
                            <a
                              href={`https://linkedin.com/in/${student.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              @{student.linkedin}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* New Team and Private Messaging Sections */}
          <TeamMessaging />
          <PrivateMessaging />
          {showSettings && <AdminSettings onClose={() => setShowSettings(false)} />}
          {isChatOpen && selectedUser && (
            <ChatModal
              onClose={() => setIsChatOpen(false)}
              otherUser={selectedUser}
              currentUser={adminUser}
            />
          )}
        </div>
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          userId={userId}
          directory={directory}
          conversations={conversationsAdmin}
          markNotificationAsRead={markNotificationAsRead}
          onOpenChat={handleOpenChatFromNotification}
          sessions={sessions}
          programs={programs}
        />
      </div>
    </div>
  );
};

export default Administrator;
