# Team Communication System - Backend

Backend API for the team communication system built with Node.js, Express, MongoDB, Socket.io, and Cloudinary.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Admin and Student roles with Team ID-based grouping
- **Real-time Messaging**: Socket.io for real-time team broadcasts and direct messages
- **File Uploads**: Cloudinary integration for media and document uploads
- **REST API**: Complete RESTful API for all operations

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-communication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
```

### 3. MongoDB Setup

Make sure MongoDB is running. You can use:
- Local MongoDB installation
- MongoDB Atlas (cloud)
- Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

Update `MONGODB_URI` in `.env` accordingly.

### 4. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env` file

### 5. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/admin/signup` - Admin signup
- `POST /api/auth/student/signup` - Student signup
- `POST /api/auth/login` - Login (admin or student)

### Users
- `GET /api/users/me` - Get current user (auth required)
- `GET /api/users/admins/:teamId/members` - Get team members (admin only)
- `GET /api/users/admins/me/stats` - Get admin stats (admin only)

### Messages
- `GET /api/messages/team/:teamId` - Get team messages
- `GET /api/messages/user/:userId` - Get direct messages with a user
- `POST /api/messages` - Send a message
- `POST /api/messages/admins/message/broadcast` - Broadcast to team (admin only)

### Uploads
- `POST /api/uploads` - Upload file to Cloudinary (auth required)

## Socket.io Events

### Client → Server
- `send_message` - Send a message
  ```js
  {
    receiverId: null | userId, // null for broadcast
    teamId: string,
    content: string | null,
    fileUrl: string | null
  }
  ```

### Server → Client
- `new_message` - New message received
- `error` - Error occurred
- `connect` - Connected to server
- `disconnect` - Disconnected from server

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Socket.io connections require authentication via handshake:
```js
socket = io(WS_URL, {
  auth: { token: '<jwt-token>' }
});
```

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: 'admin' | 'student' (required)
- `teamId`: String (required)
- `profileImage`: String (optional)
- `createdAt`: Date

### Message
- `senderId`: ObjectId (ref: User, required)
- `receiverId`: ObjectId (ref: User, nullable - null = broadcast)
- `teamId`: String (required)
- `content`: String (optional)
- `fileUrl`: String (optional)
- `readBy`: Array of ObjectIds (ref: User)
- `createdAt`: Date

## Security Notes

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- File uploads limited to 10MB
- Only admins can broadcast to their team
- Users can only access messages from their team

