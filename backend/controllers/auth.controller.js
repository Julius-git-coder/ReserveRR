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

    // Check if teamId exists (must have an admin with this teamId)
    const adminWithTeamId = await User.findOne({ role: 'admin', teamId });
    if (!adminWithTeamId) {
      return res.status(400).json({ message: 'Invalid team ID. Please contact your admin.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create student user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
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

    res.json({
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
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

