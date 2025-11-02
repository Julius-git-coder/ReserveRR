const User = require('../models/User');

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get team members (admin only)
exports.getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;

    // Verify the requesting admin owns this team
    if (req.user.role !== 'admin' || req.user.teamId !== teamId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const members = await User.find({ teamId, role: 'student' })
      .select('name email profileImage createdAt')
      .sort({ createdAt: -1 });

    res.json(members);
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
      teamId: req.user.teamId, 
      role: 'student' 
    });

    res.json({ teamSize });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

