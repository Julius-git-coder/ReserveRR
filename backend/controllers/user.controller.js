const User = require('../models/User');

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    let responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    };

    if (user.role === 'admin') {
      responseUser.teamId = user.teamId;
    } else if (user.role === 'student') {
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
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get team members - returns all team members (students + admin)
exports.getTeamMembers = async (req, res) => {
  try {
    let adminId;
    
    // Determine adminId based on user role
    if (req.user.role === 'admin') {
      adminId = req.user.id;
    } else {
      // Student - get their adminId
      const user = await User.findById(req.user.id);
      if (!user || !user.adminId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      adminId = user.adminId;
    }

    // Get admin
    const adminUser = await User.findById(adminId).select('_id name email profileImage createdAt role');
    
    // Get all students assigned to this admin
    const students = await User.find({ adminId, role: 'student' })
      .select('_id name email profileImage createdAt role studentId')
      .sort({ createdAt: -1 });

    // Return admin first, then students
    res.json([adminUser, ...students]);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin stats
exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const teamSize = await User.countDocuments({ 
      adminId: req.user.id, 
      role: 'student' 
    });

    res.json({ teamSize });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin by teamId (for student signup)
exports.getAdminByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    const admin = await User.findOne({ role: 'admin', teamId })
      .select('_id name email teamId');

    if (!admin) {
      return res.status(404).json({ message: 'No admin found with this Team ID' });
    }

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      teamId: admin.teamId,
    });
  } catch (error) {
    console.error('Get admin by teamId error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (including profileImage)
exports.updateProfile = async (req, res) => {
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
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

    if (user.role === 'admin') {
      responseUser.teamId = user.teamId;
    } else if (user.role === 'student') {
      responseUser.adminId = user.adminId.toString();
      responseUser.studentId = user.studentId || null; // Include studentId
      const admin = await User.findById(user.adminId);
      if (admin) {
        responseUser.teamId = admin.teamId;
      }
    }

    res.json(responseUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

