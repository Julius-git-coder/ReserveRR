import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import User from '../models/User.js';

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
export const uploadMiddleware = upload.single('file');

// Upload handler
export const uploadFile = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('User:', req.user ? { id: req.user._id, role: req.user.role, teamId: req.user.teamId } : 'Not found');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ message: 'No file provided' });
    }

    console.log('File received:', { 
      originalname: req.file.originalname, 
      mimetype: req.file.mimetype, 
      size: req.file.size 
    });

    // Check if Cloudinary is configured
    const hasCloudinary = !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);
    if (!hasCloudinary) {
      console.error('Cloudinary configuration missing. Checked:', {
        CLOUD_NAME: !!process.env.CLOUD_NAME,
        CLOUD_API_KEY: !!process.env.CLOUD_API_KEY,
        CLOUD_API_SECRET: !!process.env.CLOUD_API_SECRET,
      });
      return res.status(500).json({ message: 'File upload service not configured. Please check server configuration.' });
    }

    // Determine teamId based on user role
    // req.user is populated by auth middleware with full user object
    let teamId;
    if (req.user.role === 'admin') {
      // Admin has teamId directly - try both _id and direct property access
      teamId = req.user.teamId || req.user.get?.('teamId');
      
      // If still no teamId, try to fetch fresh from database
      if (!teamId) {
        console.warn('Admin user missing teamId in req.user, fetching from database:', req.user._id);
        const freshAdmin = await User.findById(req.user._id).select('teamId');
        if (freshAdmin && freshAdmin.teamId) {
          teamId = freshAdmin.teamId;
          console.log('Retrieved teamId from database:', teamId);
        }
      }
      
      if (!teamId) {
        console.error('Admin user missing teamId:', req.user._id);
        return res.status(400).json({ 
          message: 'Admin team ID not configured. Please contact support.',
          userId: req.user._id.toString()
        });
      }
    } else if (req.user.role === 'student') {
      // Student - get teamId from their admin
      // req.user.adminId should already be populated by auth middleware
      if (!req.user.adminId) {
        console.error('Student user missing adminId:', req.user._id);
        return res.status(403).json({ message: 'Invalid user configuration: student missing adminId' });
      }
      
      const admin = await User.findById(req.user.adminId).select('teamId role');
      if (!admin || admin.role !== 'admin') {
        console.error('Admin not found for student:', req.user._id, req.user.adminId);
        return res.status(403).json({ message: 'Admin not found or invalid' });
      }
      
      if (!admin.teamId) {
        console.error('Admin missing teamId:', admin._id);
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
    
    // Convert buffer to stream and upload to Cloudinary
    return new Promise((resolve, reject) => {
      let responseSent = false;
      
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // Auto-detect file type
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            if (!responseSent && !res.headersSent) {
              responseSent = true;
              res.status(500).json({ 
                message: 'File upload failed',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
              });
            }
            return reject(error);
          }
          
          if (!responseSent && !res.headersSent && result) {
            responseSent = true;
            res.json({ url: result.secure_url });
          }
          resolve(result);
        }
      );

      // Pipe buffer to stream
      const readable = Readable.from(req.file.buffer);
      readable.pipe(stream);
      
      readable.on('error', (error) => {
        console.error('Stream error:', error);
        if (!responseSent && !res.headersSent) {
          responseSent = true;
          res.status(500).json({ message: 'Error processing file' });
        }
        reject(error);
      });
      
      stream.on('error', (error) => {
        console.error('Cloudinary stream error:', error);
        if (!responseSent && !res.headersSent) {
          responseSent = true;
          res.status(500).json({ message: 'Error uploading to cloud storage' });
        }
        reject(error);
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Upload error stack:', error.stack);
    console.error('Upload error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Server error during upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  }
};

