const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const User = require('../models/User');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept images and common document types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
});

// Upload middleware
exports.uploadMiddleware = upload.single('file');

// Upload handler
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Determine teamId based on user role
    // req.user is populated by auth middleware with full user object
    let teamId;
    if (req.user.role === 'admin') {
      // Admin has teamId directly
      teamId = req.user.teamId;
    } else if (req.user.role === 'student') {
      // Student - get teamId from their admin
      // req.user.adminId should already be populated by auth middleware
      if (!req.user.adminId) {
        return res.status(403).json({ message: 'Invalid user configuration: student missing adminId' });
      }
      
      const admin = await User.findById(req.user.adminId).select('teamId role');
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: 'Admin not found or invalid' });
      }
      
      if (!admin.teamId) {
        return res.status(403).json({ message: 'Admin team ID not configured' });
      }
      
      teamId = admin.teamId;
    } else {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    if (!teamId) {
      return res.status(400).json({ message: 'Unable to determine team ID' });
    }

    const folder = `teams/${teamId}`;
    
    // Convert buffer to stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Auto-detect file type
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'File upload failed' });
        }
        
        res.json({ url: result.secure_url });
      }
    );

    // Pipe buffer to stream
    Readable.from(req.file.buffer).pipe(stream);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

