// Fixed Profile.jsx - Use actual user data from localStorage/API
import React, { useState, useEffect } from "react";
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
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../src/api/users";

const uploadToCloudinary = async (file) => {
  const cloudName = "dpttonwcs"; // Replace with your Cloudinary cloud name
  const uploadPreset = "Julius"; // Replace with your Cloudinary unsigned upload preset
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

const Profile = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user data from localStorage or API
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // First try to get from localStorage
        const localUser = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (localUser) {
          // Use local user data, but fetch fresh data from API if available
          try {
            const apiUser = await usersAPI.getMe();
            setUserProfile(apiUser);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(apiUser));
          } catch (error) {
            // If API fails, use local storage data
            console.error('Failed to fetch user data:', error);
            setUserProfile(localUser);
          }
        } else {
          // No user data, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleChange = (field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        // Update via API
        const updatedUser = await usersAPI.updateProfile({ profileImage: imageUrl });
        setUserProfile(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        e.target.value = "";
        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert("Failed to update profile picture. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      // Update profile via API
      const updatedUser = await usersAPI.updateProfile({
        name: userProfile.name,
        email: userProfile.email,
      });
      setUserProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleLogout = () => {
    if (showConfirm) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (onLogout) onLogout();
      navigate("/login");
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Reset confirmation after 3 seconds if not clicked again
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave(); // Auto-save on toggle out of edit mode
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          Unable to load profile. Please try logging in again.
        </div>
      </div>
    );
  }

  // Only show profile for students
  if (userProfile.role !== 'student') {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded">
          This profile page is for students only.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-2">Manage your personal information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEditToggle}
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
            <span>{showConfirm ? "Confirm Logout" : "Logout"}</span>
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          Are you sure you want to log out? Click the button again to confirm.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                {userProfile?.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-600 group-hover:border-yellow-500 transition-colors cursor-pointer"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 group-hover:border-yellow-500 transition-colors cursor-pointer">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                />
                {isEditing && (
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">Upload Photo</span>
                  </div>
                )}
              </div>
              <h2 className="text-white text-xl font-bold mb-1">
                {userProfile?.name || "Unknown User"}
              </h2>
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {userProfile?.studentId || "N/A"}
              </span>
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
                      value={userProfile?.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{userProfile?.name || "Not set"}</span>
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
                      value={userProfile?.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{userProfile?.email || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Student ID
                  </label>
                  <div className="flex items-center space-x-2 text-white">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>{userProfile?.studentId || "Not assigned"}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Student ID is auto-generated and cannot be changed
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
