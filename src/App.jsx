// App.jsx
import React, { useState } from "react";
import {
  Home,
  Users,
  Bell,
  FileText,
  FolderOpen,
  Dumbbell,
  UserCheck,
  Award,
  Code,
  Map,
  BookOpen,
  Library,
  BookMarked,
  Calendar,
  Briefcase,
  User,
  Menu,
  X,
} from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import useManageStore from "../src/Store/useManageStore"; // Import the store

// Import all components from Pages folder
import Announcement from "../Pages/Announcement";
import Assignments from "../Pages/Assignments";
import Attendance from "../Pages/Attendance";
import Projects from "../Pages/Projects";
import Exercises from "../Pages/Exercises";
import Grading from "../Pages/Grading";
import DaysOfLearning from "../Pages/DaysOfLearning";
import RoadMap from "../Pages/RoadMap";
import ClassMaterials from "../Pages/ClassMaterials";

import Directory from "../Pages/Directory";
import BookSession from "../Pages/BookSections";
import WorkReady from "../Pages/WorkReady";
import Profile from "../Pages/Profile";
import CampusConnect from "../Pages/CampusConnect";
import Administrator from "./Components/Administrator.jsx";

// ChatModal component (duplicated from Directory for global use in Dashboard)
const ChatModal = ({ onClose, otherUser, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { conversations, addMessage } = useManageStore();
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

// Notification Modal Component (updated for click handling)
const NotificationModal = ({
  isOpen,
  onClose,
  userId,
  directory,
  conversations,
  markNotificationAsRead,
  onOpenChat,
}) => {
  if (!isOpen) return null;

  const notifications = useManageStore
    .getState()
    .notifications.filter(
      (n) => n.userId === userId && !n.read && n.type === "message"
    );

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
              onClick={() => {
                markNotificationAsRead(notif.id);
                onClose();
                if (sender && onOpenChat) {
                  onOpenChat(sender);
                }
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-300" />
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
        })}
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "connect", icon: Users, label: "Campus Connect" },
    { id: "announcements", icon: Bell, label: "Announcements" },
    { id: "assignments", icon: FileText, label: "Assignments" },
    { id: "projects", icon: FolderOpen, label: "Projects" },
    { id: "exercises", icon: Dumbbell, label: "Exercises" },
    { id: "attendance", icon: UserCheck, label: "Attendance" },
    { id: "grading", icon: Award, label: "Grading" },
    { id: "100days", icon: Code, label: "100 Days of Code" },
    { id: "roadmap", icon: Map, label: "Roadmap" },
    { id: "materials", icon: BookOpen, label: "Class Materials" },

    { id: "directory", icon: BookMarked, label: "Directory" },
    { id: "session", icon: Calendar, label: "Book a Session" },
    { id: "workready", icon: Briefcase, label: "Available Programs" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">
                GradeA<span className="absolute top-2">+</span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-gray-800 text-white border-l-4 border-yellow-500"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// Progress Card Component
const ProgressCard = ({
  title,
  icon: Icon,
  current,
  total,
  color = "bg-yellow-500",
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-start space-x-3 mb-4">
        <Icon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
        <h3 className="text-white font-semibold flex-1 min-w-0 break-words">
          {title}
        </h3>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">Progress</span>
        <span className="text-gray-300 text-sm">
          {current} / {total} pts
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Overall Progress Component - Now dynamic
const OverallProgress = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Award className="w-8 h-8 text-yellow-500" />
        <div>
          <h2 className="text-white text-2xl font-bold">Overall Progress</h2>
          <p className="text-gray-400 text-sm">
            You have earned {current} out of {total} possible points.
          </p>
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Welcome Section Component - Now partially dynamic from roadmap
const WelcomeSection = ({ name, currentWeekData, nextWeekData }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h1 className="text-white text-3xl font-bold">
            Welcome back, {name}!
          </h1>
          <p className="text-gray-400">Here's your overview for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <h3 className="text-white font-semibold text-lg">
              This Week's Focus
            </h3>
          </div>
          <div className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            {currentWeekData?.phase || "Backend"} -{" "}
            {currentWeekData?.term || "NodeJS"} - Week{" "}
            {currentWeekData?.weekNumber || 4}
          </div>
          <ul className="space-y-3">
            {currentWeekData?.subTopics?.slice(0, 3).map((sub, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-2 text-gray-300"
              >
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 text-xs">✓</span>
                </div>
                <span>{sub.name}</span>
              </li>
            )) ||
              [
                { name: "Postman" },
                { name: "REST architecture" },
                { name: "Getting organized - controllers, routes, models" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-xs">✓</span>
                  </div>
                  <span>{item.name}</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 text-gray-400">⏰</div>
            <h3 className="text-white font-semibold text-lg">
              Next Week's Topics
            </h3>
          </div>
          <div className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            {nextWeekData?.phase || "Backend"} -{" "}
            {nextWeekData?.term || "NodeJS"} - Week{" "}
            {nextWeekData?.weekNumber || 5}
          </div>
          <ul className="space-y-3">
            {nextWeekData?.subTopics?.slice(0, 2).map((sub, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-2 text-gray-400"
              >
                <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                <span>{sub.name}</span>
              </li>
            )) ||
              [
                { name: "Databases - SQL and NoSQL" },
                { name: "Setting up Mongodb" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                  <span>{item.name}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Recent Resources Component
const RecentResources = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-white font-semibold text-lg mb-2">
        Recent Resources
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Quick access to recently added materials.
      </p>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No resources have been added yet.</p>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto">
          <span>Go to Resource Center</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

// Performance Hub Component - Now fully dynamic from store
const PerformanceHub = () => {
  const {
    attendance,
    assignments,
    exercises,
    projects,
    programs, // For soft skills
  } = useManageStore();

  const studentId = 1; // Hardcoded for demo

  // Attendance: Assume 1 point per present session, max 50
  const studentAttendance = attendance.filter((a) => a.studentId === studentId);
  const presentAttendance = studentAttendance.filter(
    (a) => a.status === "present"
  );
  const attendanceCurrent = presentAttendance.length;
  const attendanceTotal = 50; // Fixed max

  // Assignments: Sum grades for graded, total points for all
  const studentAssignments = assignments.filter(
    (a) => a.studentId === studentId
  );
  const gradedAssignments = studentAssignments.filter(
    (a) => a.status === "graded"
  );
  const assignmentsCurrent = gradedAssignments.reduce(
    (sum, a) => sum + (a.grade || 0),
    0
  );
  const assignmentsTotal = studentAssignments.reduce(
    (sum, a) => sum + a.points,
    0
  );

  // Exercises: Similar to assignments
  const studentExercises = exercises.filter((e) => e.studentId === studentId);
  const gradedExercises = studentExercises.filter((e) => e.status === "graded");
  const exercisesCurrent = gradedExercises.reduce(
    (sum, e) => sum + (e.grade || 0),
    0
  );
  const exercisesTotal = studentExercises.reduce((sum, e) => sum + e.points, 0);

  // Projects: Sum grades for graded, fixed total
  const studentProjects = projects.filter((p) => p.studentId === studentId);
  const gradedProjects = studentProjects.filter((p) => p.status === "graded");
  const projectsCurrent = gradedProjects.reduce(
    (sum, p) => sum + (p.grade || 0),
    0
  );
  const projectsTotal = 50; // Fixed for weekly projects

  // Soft Skills & Product Training: From programs milestones completed
  const enrolledPrograms = programs.filter((p) =>
    p.enrolledStudents?.includes(studentId)
  );
  const softSkillsCurrent = enrolledPrograms.reduce((sum, p) => {
    return sum + (p.milestones?.filter((m) => m.completed).length || 0);
  }, 0);
  const softSkillsTotal = 6;

  // Overall
  const overallCurrent =
    attendanceCurrent +
    assignmentsCurrent +
    exercisesCurrent +
    projectsCurrent +
    softSkillsCurrent;
  const overallTotal =
    attendanceTotal +
    assignmentsTotal +
    exercisesTotal +
    projectsTotal +
    softSkillsTotal;

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Award className="w-6 h-6 text-yellow-500" />
        <h2 className="text-white text-2xl font-bold">Performance Hub</h2>
      </div>
      <p className="text-gray-400 mb-6">
        Your academic points breakdown and progress.
      </p>

      <OverallProgress current={overallCurrent} total={overallTotal} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressCard
          title="Class Attendance"
          icon={UserCheck}
          current={attendanceCurrent}
          total={attendanceTotal}
        />
        <ProgressCard
          title="Class Assignments"
          icon={FileText}
          current={assignmentsCurrent}
          total={assignmentsTotal}
        />
        <ProgressCard
          title="Class Exercises"
          icon={Dumbbell}
          current={exercisesCurrent}
          total={exercisesTotal}
        />
        <ProgressCard
          title="Projects"
          icon={FolderOpen}
          current={projectsCurrent}
          total={projectsTotal}
        />
        <ProgressCard
          title="Soft Skills & Product Training"
          icon={Award}
          current={softSkillsCurrent}
          total={softSkillsTotal}
          color="bg-blue-500"
        />
      </div>
    </div>
  );
};

// Dashboard Content Component - Now passes dynamic data to WelcomeSection
const DashboardContent = () => {
  const { profile } = useManageStore();
  const { roadmapItems } = useManageStore();
  const studentId = 1;

  // Find current and next week data from roadmap
  let currentWeekData = null;
  let nextWeekData = null;
  roadmapItems.forEach((item) => {
    if (item.weeks) {
      const currentWeekIndex = item.weeks.findIndex((w) => w.current);
      if (currentWeekIndex !== -1) {
        currentWeekData = {
          phase: item.phase,
          term: item.term,
          weekNumber: item.weeks[currentWeekIndex].weekNumber,
          subTopics: item.weeks[currentWeekIndex].subTopics || [],
        };
      }
      const nextWeekIndex = item.weeks.findIndex((w) => w.next);
      if (nextWeekIndex !== -1) {
        nextWeekData = {
          phase: item.phase,
          term: item.term,
          weekNumber: item.weeks[nextWeekIndex].weekNumber,
          subTopics: item.weeks[nextWeekIndex].subTopics || [],
        };
      }
    }
  });

  return (
    <div>
      <WelcomeSection
        name={profile.name || "Julius Dagana"}
        currentWeekData={currentWeekData}
        nextWeekData={nextWeekData}
      />
      <PerformanceHub />
      <RecentResources />
    </div>
  );
};

// Protected Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const markAsRead = useManageStore((state) => state.markAsRead);
  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );
  const { directory, conversations } = useManageStore();
  const userId = 1;
  const currentUser = { id: 1, name: "Julius Dagana" };

  const handleBellClick = () => {
    setIsNotificationOpen(true);
    markAsRead(userId);
  };

  const handleOpenChatFromNotification = (sender) => {
    setSelectedUser(sender);
    setIsChatOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "connect":
        return <CampusConnect />;
      case "announcements":
        return <Announcement />;
      case "assignments":
        return <Assignments />;
      case "projects":
        return <Projects />;
      case "exercises":
        return <Exercises />;
      case "attendance":
        return <Attendance />;
      case "grading":
        return <Grading />;
      case "100days":
        return <DaysOfLearning />;
      case "roadmap":
        return <RoadMap />;
      case "materials":
        return <ClassMaterials />;
      case "directory":
        return <Directory />;
      case "session":
        return <BookSession />;
      case "workready":
        return <WorkReady />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              <button
                onClick={handleBellClick}
                className="relative text-gray-400 hover:text-white"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {
                    useManageStore
                      .getState()
                      .notifications.filter(
                        (n) => n.userId === userId && !n.read
                      ).length
                  }
                </span>
              </button>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>

      {isChatOpen && selectedUser && (
        <ChatModal
          onClose={() => setIsChatOpen(false)}
          otherUser={selectedUser}
          currentUser={currentUser}
        />
      )}

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userId={userId}
        directory={directory}
        conversations={conversations}
        markNotificationAsRead={markNotificationAsRead}
        onOpenChat={handleOpenChatFromNotification}
      />
    </div>
  );
};

// Protected Administrator Component
const ProtectedAdministrator = () => {
  return <Administrator />;
};

// Main App Component
const App = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Administrator" element={<ProtectedAdministrator />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
