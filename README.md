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



<!-- my compus connect is working  -->
<!-- the student profile is working  -->
<!-- student directory when send request the other recipient don't see it  -->

<!-- admin profile is not working -->
<!-- fix the so that when the admin send any of the information the student is notified and can see it -->
<!-- in admin dashboard fix the student directory so that only the currently available student appears there  -->
<!-- fix so that when the student send anything to the admin the admin can see it and also notified -->
 <!-- in the student mangement modal fix so that each user have  their respective profile   -->