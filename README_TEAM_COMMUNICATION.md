# Team Communication System - Complete Setup Guide

This document provides setup instructions for the complete team communication system.

## Project Structure

```
ReserveRR/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database and Cloudinary config
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Auth and role middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── socket.js           # Socket.io setup
│   └── server.js           # Express server
├── src/
│   ├── api/                # API client utilities
│   ├── components/         # React components
│   │   ├── AdminDashboard.jsx
│   │   ├── ChatWindow.jsx
│   │   └── StudentProfile.jsx
│   ├── context/            # React contexts
│   │   └── SocketContext.jsx
│   └── ...
└── Pages/                  # Page components
    ├── Login.jsx
    ├── AdminSignUp.jsx
    └── StudentSignUp.jsx
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 2. Frontend Setup

```bash
# From project root
npm install
# Create .env file for frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
echo "VITE_WS_URL=http://localhost:5000" >> .env
npm run dev
```

### 3. Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-communication
JWT_SECRET=your-super-secret-jwt-key
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

## Features

### Authentication
- ✅ Admin signup with unique Team ID
- ✅ Student signup with Team ID validation
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt

### Real-time Communication
- ✅ Socket.io for real-time messaging
- ✅ Team broadcasts (admin → all team members)
- ✅ Direct messages (admin ↔ student, student ↔ student)
- ✅ File uploads via Cloudinary
- ✅ Message persistence in MongoDB

### User Management
- ✅ Role-based access control (admin/student)
- ✅ Team-based grouping
- ✅ Admin dashboard with team stats
- ✅ Student profile management

## Usage Flow

### Admin Flow
1. Sign up with email, password, and unique Team ID
2. Access admin dashboard
3. View team members and stats
4. Broadcast messages to entire team
5. Send private messages to individual students
6. Manage team communication

### Student Flow
1. Sign up with email, password, and Team ID (from admin)
2. Access student dashboard
3. View team chat and announcements
4. Send messages to admin or other students
5. Receive real-time updates

## API Endpoints

See `backend/README.md` for complete API documentation.

## Testing

### Manual Testing Steps

1. **Admin Signup**
   - Go to `/admin-signup`
   - Create admin account with Team ID (e.g., "TEAM001")
   - Should redirect to `/Administrator`

2. **Student Signup**
   - Go to `/student-signup`
   - Use the Team ID from step 1
   - Should redirect to `/dashboard`

3. **Login**
   - Go to `/login`
   - Login with created credentials
   - Should redirect based on role

4. **Team Communication**
   - As admin: Broadcast messages via dashboard
   - As student: View broadcasts and send messages
   - Verify real-time updates

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running
- **JWT Errors**: Check JWT_SECRET in .env
- **Cloudinary Errors**: Verify Cloudinary credentials

### Frontend Issues
- **API Connection Error**: Check VITE_API_URL in .env
- **Socket Connection Error**: Check VITE_WS_URL and backend is running
- **CORS Errors**: Backend CORS is set to allow all origins (adjust in production)

## Production Deployment

1. Set secure JWT_SECRET
2. Use MongoDB Atlas or managed MongoDB
3. Configure Cloudinary for production
4. Set CORS to specific frontend domain
5. Use environment variables for all secrets
6. Enable HTTPS
7. Set up rate limiting
8. Add logging and monitoring

## Next Steps

- Add message read receipts
- Implement typing indicators
- Add message search functionality
- Implement notifications
- Add user online/offline status
- Create mobile app version

