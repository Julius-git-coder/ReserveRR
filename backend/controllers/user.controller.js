import User from "../models/User.js";

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    let responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    if (user.role === "admin") {
      responseUser.teamId = user.teamId;
    } else if (user.role === "student") {
      responseUser.adminId = user.adminId.toString();
      responseUser.studentId = user.studentId || null; // Include studentId
      // Get admin's teamId for display
      const admin = await User.findById(user.adminId);
      if (admin) {
        responseUser.teamId = admin.teamId;
      }
    }

    res.json(responseUser);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get team members - returns all team members (students + admin)
export const getTeamMembers = async (req, res) => {
  try {
    let adminId;

    // Determine adminId based on user role
    if (req.user.role === "admin") {
      adminId = req.user.id;
    } else {
      // Student - get their adminId
      const user = await User.findById(req.user.id);
      if (!user || !user.adminId) {
        return res.status(403).json({ message: "Access denied" });
      }
      adminId = user.adminId;
    }

    // Get admin
    const adminUser = await User.findById(adminId).select(
      "_id name email profileImage createdAt role"
    );

    // Get all students assigned to this admin
    const students = await User.find({ adminId, role: "student" })
      .select("_id name email profileImage createdAt role studentId status")
      .sort({ createdAt: -1 });

    // Return admin first, then students
    res.json([adminUser, ...students]);
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get admin stats
export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const teamSize = await User.countDocuments({
      adminId: req.user.id,
      role: "student",
    });

    res.json({ teamSize });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get admin by teamId (for student signup)
export const getAdminByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    const admin = await User.findOne({ role: "admin", teamId }).select(
      "_id name email teamId"
    );

    if (!admin) {
      return res
        .status(404)
        .json({ message: "No admin found with this Team ID" });
    }

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      teamId: admin.teamId,
    });
  } catch (error) {
    console.error("Get admin by teamId error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile (including profileImage)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    const userId = req.user.id;

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build response similar to getMe
    let responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    if (user.role === "admin") {
      responseUser.teamId = user.teamId;
    } else if (user.role === "student") {
      responseUser.adminId = user.adminId.toString();
      responseUser.studentId = user.studentId || null; // Include studentId
      const admin = await User.findById(user.adminId);
      if (admin) {
        responseUser.teamId = admin.teamId;
      }
    }

    res.json(responseUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete student (admin only)
export const deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentId } = req.params;

    // Verify student exists and belongs to this admin
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.role !== "student") {
      return res.status(400).json({ message: "User is not a student" });
    }

    if (student.adminId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Student does not belong to your team" });
    }

    // Delete the student
    await User.findByIdAndDelete(studentId);

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Suspend/Unsuspend student (admin only)
export const updateStudentStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentId } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "active" or "suspended"' });
    }

    // Verify student exists and belongs to this admin
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.role !== "student") {
      return res.status(400).json({ message: "User is not a student" });
    }

    if (student.adminId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Student does not belong to your team" });
    }

    // Update student status
    student.status = status;
    await student.save();

    // Return updated student
    const updatedStudent = await User.findById(studentId).select(
      "_id name email profileImage createdAt role studentId status"
    );

    res.json({
      message: `Student ${
        status === "suspended" ? "suspended" : "activated"
      } successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update student status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
