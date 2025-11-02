const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin signup
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, teamId, profileImage } = req.body;

    // Validation
    if (!name || !email || !password || !teamId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if teamId already exists for an admin
    const existingTeamId = await User.findOne({ role: 'admin', teamId });
    if (existingTeamId) {
      return res.status(400).json({ message: 'Team ID already taken. Please choose another one.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      teamId,
      profileImage: profileImage || null,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }
};

// Student signup
exports.studentSignup = async (req, res) => {
  try {
    const { name, email, password, adminId, profileImage } = req.body;

    // Validation
    if (!name || !email || !password || !adminId) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password, adminId)' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if adminId exists and is an admin
    const admin = await User.findOne({ _id: adminId, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid admin ID. Please contact your admin for the correct ID.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create student user with adminId reference
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      adminId: admin._id,
      profileImage: profileImage || null,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminId: user.adminId.toString(),
        teamId: admin.teamId, // Return admin's teamId for display
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ message: error.message || 'Server error during signup' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Populate admin info if student
    let responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    };

    if (user.role === 'admin') {
      responseUser.teamId = user.teamId;
    } else if (user.role === 'student') {
      responseUser.adminId = user.adminId.toString();
      // Get admin's teamId for display
      const admin = await User.findById(user.adminId);
      if (admin) {
        responseUser.teamId = admin.teamId;
      }
    }

    res.json({
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

