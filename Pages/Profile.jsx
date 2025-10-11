import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Edit,
  Save,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useManageStore from "../src/Store/useManageStore";


const Profile = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { profile, updateProfile } = useManageStore();

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    updateProfile({ [field]: value });
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const stats = [
    { label: "Days Active", value: "45" },
    { label: "Projects Completed", value: "3" },
    { label: "Assignments Submitted", value: "12" },
    { label: "Attendance Rate", value: "92%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-2">Manage your personal information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-white text-xl font-bold mb-1">
                {profile.name}
              </h2>
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {profile.cohort}
              </span>
              <p className="text-gray-400 text-center text-sm mb-4">
                {profile.bio}
              </p>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <span>Joined {profile.startDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
            <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                  <span className="text-white font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-6">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{profile.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500 resize-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-white">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
            <h3 className="text-white text-lg font-semibold mb-6">
              Social Links
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  GitHub Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => handleChange("github", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Github className="w-4 h-4 text-gray-400" />
                    <span>github.com/{profile.github}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  LinkedIn Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                    <span>linkedin.com/in/{profile.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
