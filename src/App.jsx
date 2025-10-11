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
import ResourceLibrary from "../Pages/ResourceLibrary";
import Directory from "../Pages/Directory";
import BookSession from "../Pages/BookSections";
import WorkReady from "../Pages/WorkReady";
import Profile from "../Pages/Profile";
import CampusConnect from "../Pages/CampusConnect";
import Administrator from "./Components/Administrator.jsx";

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
    { id: "resources", icon: Library, label: "Resources Library" },
    { id: "directory", icon: BookMarked, label: "Directory" },
    { id: "session", icon: Calendar, label: "Book a Session" },
    { id: "workready", icon: Briefcase, label: "Work Ready" },
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
  const percentage = (current / total) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-gray-400" />
        <h3 className="text-white font-semibold">{title}</h3>
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

// Overall Progress Component
const OverallProgress = ({ current, total }) => {
  const percentage = (current / total) * 100;

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

// Welcome Section Component
const WelcomeSection = ({ name }) => {
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
            Backend - NodeJS - Week 4
          </div>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2 text-gray-300">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-gray-900 text-xs">✓</span>
              </div>
              <span>Postman</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-300">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-gray-900 text-xs">✓</span>
              </div>
              <span>REST architecture</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-300">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-gray-900 text-xs">✓</span>
              </div>
              <span>Getting organized - controllers, routes, models</span>
            </li>
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
            Backend - NodeJS - Week 5
          </div>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
              <span>Databases - SQL and NoSQL</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
              <span>Setting up Mongodb</span>
            </li>
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

// Performance Hub Component
const PerformanceHub = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Award className="w-6 h-6 text-yellow-500" />
        <h2 className="text-white text-2xl font-bold">Performance Hub</h2>
      </div>
      <p className="text-gray-400 mb-6">
        Your academic points breakdown and progress.
      </p>

      <OverallProgress current={116} total={286} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressCard
          title="Class Attendance"
          icon={UserCheck}
          current={33}
          total={50}
        />
        <ProgressCard
          title="Class Assignments"
          icon={FileText}
          current={28}
          total={50}
        />
        <ProgressCard
          title="Class Exercises"
          icon={Dumbbell}
          current={29}
          total={50}
        />
        <ProgressCard
          title="Weekly Projects"
          icon={FolderOpen}
          current={3}
          total={50}
        />
        <ProgressCard
          title="Monthly Personal Projects"
          icon={Briefcase}
          current={0}
          total={10}
        />
        <ProgressCard
          title="Soft Skills & Product Training"
          icon={Award}
          current={0}
          total={6}
        />
        <ProgressCard
          title="Mini Demo Days"
          icon={Calendar}
          current={5}
          total={5}
        />
        <ProgressCard
          title="100 Days of Code"
          icon={Code}
          current={18}
          total={50}
        />
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  return (
    <div>
      <WelcomeSection name="Julius Dagana" />
      <PerformanceHub />
      <RecentResources />
    </div>
  );
};

// Protected Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      case "resources":
        return <ResourceLibrary />;
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
              <button className="text-gray-400 hover:text-white">
                <Bell className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
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
