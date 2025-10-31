untouched reserved code for the Grade A +

Backend/
│
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── userModel.js
│   ├── announcementModel.js
│   ├── assignmentModel.js
│   ├── attendanceModel.js
│   ├── projectModel.js
│   ├── exerciseModel.js
│   ├── gradeModel.js
│   ├── roadmapModel.js
│   ├── materialModel.js
│   ├── workReadyModel.js
│   ├── sessionModel.js
│   ├── messageModel.js
│   └── teamModel.js
│
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── studentController.js
│   ├── contentController.js   ← for all view-only pages
│   ├── messageController.js   ← for Directory & CampusConnect
│   └── teamController.js
│
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── studentRoutes.js
│   ├── contentRoutes.js
│   ├── messageRoutes.js
│   └── teamRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── utils/
│   ├── generateToken.js
│   ├── fileUploader.js
│   └── socket.js   ← for real-time chat
└── .env



<!-- Frontend -->
Frontend/
│
├── src/
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── Announcement.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Exercises.jsx
│   │   │   ├── Grading.jsx
│   │   │   ├── RoadMap.jsx
│   │   │   ├── ClassMaterials.jsx
│   │   │   ├── WorkReady.jsx
│   │   │   ├── BookSession.jsx
│   │   │   ├── Directory.jsx
│   │   │   ├── CampusConnect.jsx
│   │   │   └── Profile.jsx
│   │   ├── Student/
│   │   │   ├── Directory.jsx  ← private chat (with admin)
│   │   │   ├── CampusConnect.jsx  ← team-wide chat
│   │   │   ├── Profile.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Exercises.jsx
│   │   │   ├── Grading.jsx
│   │   │   ├── RoadMap.jsx
│   │   │   ├── ClassMaterials.jsx
│   │   │   ├── WorkReady.jsx
│   │   │   └── BookSession.jsx
│   │   └── Auth/
│   │       ├── AdminSignup.jsx
│   │       ├── StudentSignup.jsx
│   │       └── Login.jsx
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── StudentRoute.jsx
│   ├── utils/
│   │   ├── axiosInstance.js
│   │   ├── socket.js
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
