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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useManageStore from "../src/Store/useManageStore"; // Adjust path if needed
import {
  auth,
  onAuthStateChanged,
  getUserProfile,
  saveUserProfile,
} from "../Service/FirebaseConfig"; // Now this should work!

const Profile = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { profile, updateProfile } = useManageStore();

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        setError(null);
        try {
          // Fetch full user profile from Firestore using UID
          const userProfile = await getUserProfile(user.uid);
          // Update store with fetched profile, merging with auth data if needed
          updateProfile({
            ...userProfile,
            email: user.email || userProfile?.email,
            name: user.displayName || userProfile?.name,
          });
        } catch (err) {
          console.error("Error loading profile:", err);
          setError("Failed to load profile. Using defaults.");
          // Fallback to basic auth data only
          updateProfile({
            name: user.displayName || "",
            email: user.email || "",
            // Set defaults for other fields (matching your store init)
            phone: "",
            location: "",
            github: "",
            linkedin: "",
            bio: "",
            cohort: "2024-B",
            startDate: new Date().toLocaleDateString(),
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Redirect to login if no user
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [updateProfile, navigate]);

  const handleChange = (field, value) => {
    updateProfile({ [field]: value });
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await saveUserProfile(user.uid, profile);
        setIsEditing(false);
        // Optional: Show success toast instead of alert
        alert("Profile saved successfully!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleLogout = () => {
    if (showConfirm) {
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

  // Show loading spinner while fetching profile
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  // Show error if fetch failed
  if (error) {
    console.warn(error);
  }

  const stats = [
    { label: "Days Active", value: "45" },
    { label: "Projects Completed", value: "3" },
    { label: "Assignments Submitted", value: "12" },
    { label: "Attendance Rate", value: "92%" },
  ];

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
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
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
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
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

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-white text-xl font-bold mb-1">
                {profile.name || "Unknown User"}
              </h2>
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {profile.cohort || "N/A"}
              </span>
              <p className="text-gray-400 text-center text-sm mb-4">
                {profile.bio || "No bio available"}
              </p>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <span>Joined {profile.startDate || "N/A"}</span>
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
                      value={profile.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{profile.name || "Not set"}</span>
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
                      value={profile.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{profile.email || "Not set"}</span>
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
                      value={profile.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phone || "Not set"}</span>
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
                      value={profile.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{profile.location || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profile.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500 resize-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-white">
                    {profile.bio || "No bio available"}
                  </p>
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
                    value={profile.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Github className="w-4 h-4 text-gray-400" />
                    <span>
                      {profile.github
                        ? `github.com/${profile.github}`
                        : "Not set"}
                    </span>
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
                    value={profile.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                    <span>
                      {profile.linkedin
                        ? `linkedin.com/in/${profile.linkedin}`
                        : "Not set"}
                    </span>
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
