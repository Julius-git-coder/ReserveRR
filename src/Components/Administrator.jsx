// // import React, { useState, useEffect } from "react";
// // import {
// //   Users,
// //   BookOpen,
// //   TrendingUp,
// //   Bell,
// //   Calendar,
// //   Search,
// //   Edit,
// //   Trash2,
// //   MoreVertical,
// //   UserPlus,
// //   Settings,
// //   Award,
// //   CheckCircle,
// //   X,
// // } from "lucide-react";
// // import useManageStore from "./../Store/useManageStore";


// // const Administrator = () => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [activeTab, setActiveTab] = useState("overview");
// //   const [selectedForm, setSelectedForm] = useState("");
// //   const [formData, setFormData] = useState({});
// //   const {
// //     announcements,
// //     addAnnouncement,
// //     events,
// //     addEvent,
// //     updateEvent,
// //     deleteEvent,
// //     assignments,
// //     addAssignment,
// //     updateAssignment,
// //     addWorkReadyResource,
// //     addRoadmapItem,
// //     addResource,
// //     addProject,
// //     updateProfile,
// //     addGrade,
// //     addExercise,
// //     addDirectoryEntry,
// //     updateDaysOfLearning,
// //     addClassMaterial,
// //     addPost,
// //     addSession,
// //   } = useManageStore();

// //   const [recentStudents] = useState([
// //     {
// //       id: 1,
// //       name: "Julius Dagana",
// //       email: "julius@example.com",
// //       cohort: "2024-B",
// //       status: "active",
// //       attendance: 92,
// //     },
// //   ]);

// //   const stats = [
// //     { label: "Total Students", value: "156", icon: Users, color: "yellow" },
// //     { label: "Active Courses", value: "8", icon: BookOpen, color: "blue" },
// //   ];

// //   const pendingActions = assignments
// //     .filter((assignment) => assignment.status === "submitted")
// //     .map((assignment) => ({
// //       id: assignment.id,
// //       type: "Assignment Review",
// //       student:
// //         recentStudents.find((s) => s.id === assignment.studentId)?.name ||
// //         "Unknown",
// //       description: assignment.title,
// //       priority: "medium",
// //     }));

// //   const StatIcon = ({ icon: Icon, color }) => (
// //     <Icon
// //       className={`w-8 h-8 ${
// //         color === "yellow"
// //           ? "text-yellow-500"
// //           : color === "blue"
// //           ? "text-blue-500"
// //           : color === "green"
// //           ? "text-green-500"
// //           : "text-purple-500"
// //       }`}
// //     />
// //   );

// //   const handleFormChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleFormSubmit = (e) => {
// //     e.preventDefault();
// //     const newId = (arr) =>
// //       arr.length ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
// //     switch (selectedForm) {
// //       case "announcement":
// //         addAnnouncement({
// //           id: newId(announcements),
// //           title: formData.title || "",
// //           content: formData.content || "",
// //           date: new Date().toISOString().split("T")[0],
// //           priority: formData.priority || "medium",
// //           author: formData.author || "Admin Team",
// //         });
// //         break;
// //       case "assignment":
// //         if (
// //           !formData.title ||
// //           !formData.dueDate ||
// //           !formData.points ||
// //           !formData.studentId
// //         ) {
// //           alert("Please fill in all required fields.");
// //           return;
// //         }
// //         const points = parseInt(formData.points);
// //         if (isNaN(points) || points <= 0) {
// //           alert("Please enter a valid number of points.");
// //           return;
// //         }
// //         addAssignment({
// //           id: newId(assignments),
// //           title: formData.title,
// //           description: formData.description || "",
// //           dueDate: formData.dueDate,
// //           points,
// //           studentId: parseInt(formData.studentId),
// //           status: "pending",
// //         });
// //         break;
// //       case "event":
// //         addEvent({
// //           id: newId(events),
// //           event: formData.event || "",
// //           date: formData.date || "",
// //           time: formData.time || "",
// //         });
// //         break;
// //       case "workReadyResource":
// //         addWorkReadyResource({
// //           id: newId([]),
// //           title: formData.title || "",
// //           description: formData.description || "",
// //           type: formData.type || "Document",
// //           status: formData.status || "available",
// //         });
// //         break;
// //       case "roadmapItem":
// //         addRoadmapItem({
// //           id: newId([]),
// //           phase: formData.phase || "",
// //           status: formData.status || "upcoming",
// //           weeks: formData.weeks
// //             ? JSON.parse(formData.weeks)
// //             : [{ week: 1, topic: "", completed: false }],
// //         });
// //         break;
// //       case "resource":
// //         addResource({
// //           id: newId([]),
// //           title: formData.title || "",
// //           type: formData.type || "Article",
// //           category: formData.category || "",
// //           description: formData.description || "",
// //           link: formData.link || "#",
// //         });
// //         break;
// //       case "project":
// //         addProject({
// //           id: newId([]),
// //           title: formData.title || "",
// //           week: parseInt(formData.week) || 1,
// //           status: formData.status || "in-progress",
// //           technologies: formData.technologies
// //             ? formData.technologies.split(",")
// //             : [],
// //         });
// //         break;
// //       case "profile":
// //         updateProfile({
// //           name: formData.name || "",
// //           email: formData.email || "",
// //           phone: formData.phone || "",
// //           location: formData.location || "",
// //           github: formData.github || "",
// //           linkedin: formData.linkedin || "",
// //           bio: formData.bio || "",
// //           cohort: formData.cohort || "",
// //           startDate: formData.startDate || "",
// //         });
// //         break;
// //       case "grade":
// //         addGrade({
// //           id: newId([]),
// //           category: formData.category || "",
// //           earned: parseFloat(formData.earned) || 0,
// //           total: parseFloat(formData.total) || 0,
// //           percentage: (
// //             (parseFloat(formData.earned) / parseFloat(formData.total)) *
// //             100
// //           ).toFixed(1),
// //         });
// //         break;
// //       case "exercise":
// //         addExercise({
// //           id: newId([]),
// //           title: formData.title || "",
// //           points: parseInt(formData.points) || 0,
// //           completed: formData.completed === "true",
// //         });
// //         break;
// //       case "directoryEntry":
// //         addDirectoryEntry({
// //           id: newId([]),
// //           name: formData.name || "",
// //           role: formData.role || "Student",
// //           email: formData.email || "",
// //           github: formData.github || "",
// //           cohort: formData.cohort || "",
// //           specialty: formData.specialty || "",
// //         });
// //         break;
// //       case "daysOfLearning":
// //         updateDaysOfLearning({
// //           completedDays: parseInt(formData.completedDays) || 0,
// //           totalDays: parseInt(formData.totalDays) || 100,
// //           activities: formData.activities
// //             ? JSON.parse(formData.activities)
// //             : [],
// //         });
// //         break;
// //       case "classMaterial":
// //         addClassMaterial({
// //           id: newId([]),
// //           week: parseInt(formData.week) || 1,
// //           title: formData.title || "",
// //           topics: formData.topics ? formData.topics.split(",") : [],
// //           resources: parseInt(formData.resources) || 0,
// //           files: formData.files
// //             ? JSON.parse(formData.files)
// //             : [{ name: "", type: "PDF", size: "" }],
// //         });
// //         break;
// //       case "post":
// //         addPost({
// //           id: newId([]),
// //           author: formData.author || "Admin Team",
// //           timestamp: new Date().toISOString(),
// //           content: formData.content || "",
// //           likes: 0,
// //           comments: 0,
// //         });
// //         break;
// //       case "session":
// //         addSession({
// //           id: newId([]),
// //           title: formData.title || "",
// //           instructor: formData.instructor || "",
// //           date: formData.date || "",
// //           time: formData.time || "",
// //           duration: formData.duration || "30 min",
// //           status: formData.status || "pending",
// //         });
// //         break;
// //       default:
// //         break;
// //     }
// //     setFormData({});
// //     setSelectedForm("");
// //   };

// //   const handleEditEvent = (event) => {
// //     setFormData({
// //       id: event.id,
// //       event: event.event,
// //       date: event.date,
// //       time: event.time,
// //     });
// //     setSelectedForm("event");
// //   };

// //   const handleGradeChange = (assignmentId, value) => {
// //     setFormData((prev) => ({ ...prev, [assignmentId]: value }));
// //   };

// //   const handleGradeSubmit = (assignmentId) => {
// //     const grade = parseFloat(formData[assignmentId]);
// //     const assignment = assignments.find((a) => a.id === assignmentId);
// //     if (isNaN(grade) || grade < 0 || grade > assignment.points) {
// //       alert("Please enter a valid grade between 0 and the maximum points.");
// //       return;
// //     }
// //     updateAssignment(assignmentId, { status: "graded", grade });
// //     setFormData((prev) => ({ ...prev, [assignmentId]: "" }));
// //   };

// //   const filteredStudents = recentStudents.filter(
// //     (student) =>
// //       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       student.email.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const filteredAssignments =
// //     activeTab === "assignments"
// //       ? assignments.filter(
// //           (a) =>
// //             a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             recentStudents
// //               .find((s) => s.id === a.studentId)
// //               ?.name.toLowerCase()
// //               .includes(searchTerm.toLowerCase())
// //         )
// //       : assignments;

// //   const renderForm = () => {
// //     switch (selectedForm) {
// //       case "announcement":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Content
// //               </label>
// //               <textarea
// //                 value={formData.content || ""}
// //                 onChange={(e) => handleFormChange("content", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Priority
// //               </label>
// //               <select
// //                 value={formData.priority || "medium"}
// //                 onChange={(e) => handleFormChange("priority", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="low">Low</option>
// //                 <option value="medium">Medium</option>
// //                 <option value="high">High</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Author</label>
// //               <input
// //                 type="text"
// //                 value={formData.author || "Admin Team"}
// //                 onChange={(e) => handleFormChange("author", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "assignment":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Description
// //               </label>
// //               <textarea
// //                 value={formData.description || ""}
// //                 onChange={(e) =>
// //                   handleFormChange("description", e.target.value)
// //                 }
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Due Date
// //               </label>
// //               <input
// //                 type="date"
// //                 value={formData.dueDate || ""}
// //                 onChange={(e) => handleFormChange("dueDate", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Points</label>
// //               <input
// //                 type="number"
// //                 value={formData.points || ""}
// //                 onChange={(e) => handleFormChange("points", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Student ID
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.studentId || ""}
// //                 onChange={(e) => handleFormChange("studentId", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "event":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Event</label>
// //               <input
// //                 type="text"
// //                 value={formData.event || ""}
// //                 onChange={(e) => handleFormChange("event", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Date</label>
// //               <input
// //                 type="date"
// //                 value={formData.date || ""}
// //                 onChange={(e) => handleFormChange("date", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Time</label>
// //               <input
// //                 type="time"
// //                 value={formData.time || ""}
// //                 onChange={(e) => handleFormChange("time", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       // Add forms for other pages (WorkReady, RoadMap, etc.)
// //       case "workReadyResource":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Description
// //               </label>
// //               <textarea
// //                 value={formData.description || ""}
// //                 onChange={(e) =>
// //                   handleFormChange("description", e.target.value)
// //                 }
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Type</label>
// //               <select
// //                 value={formData.type || "Document"}
// //                 onChange={(e) => handleFormChange("type", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="Document">Document</option>
// //                 <option value="Session">Session</option>
// //                 <option value="Workshop">Workshop</option>
// //                 <option value="Guide">Guide</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Status</label>
// //               <select
// //                 value={formData.status || "available"}
// //                 onChange={(e) => handleFormChange("status", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="available">Available</option>
// //                 <option value="upcoming">Upcoming</option>
// //               </select>
// //             </div>
// //           </div>
// //         );
// //       case "roadmapItem":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Phase</label>
// //               <input
// //                 type="text"
// //                 value={formData.phase || ""}
// //                 onChange={(e) => handleFormChange("phase", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Status</label>
// //               <select
// //                 value={formData.status || "upcoming"}
// //                 onChange={(e) => handleFormChange("status", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="completed">Completed</option>
// //                 <option value="in-progress">In Progress</option>
// //                 <option value="upcoming">Upcoming</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Weeks (JSON format)
// //               </label>
// //               <textarea
// //                 value={
// //                   formData.weeks || '[{"week":1,"topic":"","completed":false}]'
// //                 }
// //                 onChange={(e) => handleFormChange("weeks", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "resource":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Type</label>
// //               <select
// //                 value={formData.type || "Article"}
// //                 onChange={(e) => handleFormChange("type", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="Video">Video</option>
// //                 <option value="Article">Article</option>
// //                 <option value="eBook">eBook</option>
// //                 <option value="Documentation">Documentation</option>
// //                 <option value="Tutorial">Tutorial</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Category
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.category || ""}
// //                 onChange={(e) => handleFormChange("category", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Description
// //               </label>
// //               <textarea
// //                 value={formData.description || ""}
// //                 onChange={(e) =>
// //                   handleFormChange("description", e.target.value)
// //                 }
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Link</label>
// //               <input
// //                 type="text"
// //                 value={formData.link || ""}
// //                 onChange={(e) => handleFormChange("link", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "project":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Week</label>
// //               <input
// //                 type="number"
// //                 value={formData.week || ""}
// //                 onChange={(e) => handleFormChange("week", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Status</label>
// //               <select
// //                 value={formData.status || "in-progress"}
// //                 onChange={(e) => handleFormChange("status", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="completed">Completed</option>
// //                 <option value="in-progress">In Progress</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Technologies (comma-separated)
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.technologies || ""}
// //                 onChange={(e) =>
// //                   handleFormChange("technologies", e.target.value)
// //                 }
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "profile":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Full Name
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.name || ""}
// //                 onChange={(e) => handleFormChange("name", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Email</label>
// //               <input
// //                 type="email"
// //                 value={formData.email || ""}
// //                 onChange={(e) => handleFormChange("email", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Phone</label>
// //               <input
// //                 type="tel"
// //                 value={formData.phone || ""}
// //                 onChange={(e) => handleFormChange("phone", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Location
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.location || ""}
// //                 onChange={(e) => handleFormChange("location", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">GitHub</label>
// //               <input
// //                 type="text"
// //                 value={formData.github || ""}
// //                 onChange={(e) => handleFormChange("github", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 LinkedIn
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.linkedin || ""}
// //                 onChange={(e) => handleFormChange("linkedin", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Bio</label>
// //               <textarea
// //                 value={formData.bio || ""}
// //                 onChange={(e) => handleFormChange("bio", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Cohort</label>
// //               <input
// //                 type="text"
// //                 value={formData.cohort || ""}
// //                 onChange={(e) => handleFormChange("cohort", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Start Date
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.startDate || ""}
// //                 onChange={(e) => handleFormChange("startDate", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "grade":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Category
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.category || ""}
// //                 onChange={(e) => handleFormChange("category", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Earned Points
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.earned || ""}
// //                 onChange={(e) => handleFormChange("earned", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Total Points
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.total || ""}
// //                 onChange={(e) => handleFormChange("total", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "exercise":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Points</label>
// //               <input
// //                 type="number"
// //                 value={formData.points || ""}
// //                 onChange={(e) => handleFormChange("points", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Completed
// //               </label>
// //               <select
// //                 value={formData.completed || "false"}
// //                 onChange={(e) => handleFormChange("completed", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="true">True</option>
// //                 <option value="false">False</option>
// //               </select>
// //             </div>
// //           </div>
// //         );
// //       case "directoryEntry":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Name</label>
// //               <input
// //                 type="text"
// //                 value={formData.name || ""}
// //                 onChange={(e) => handleFormChange("name", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Role</label>
// //               <select
// //                 value={formData.role || "Student"}
// //                 onChange={(e) => handleFormChange("role", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="Student">Student</option>
// //                 <option value="Instructor">Instructor</option>
// //                 <option value="Teaching Assistant">Teaching Assistant</option>
// //               </select>
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Email</label>
// //               <input
// //                 type="email"
// //                 value={formData.email || ""}
// //                 onChange={(e) => handleFormChange("email", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">GitHub</label>
// //               <input
// //                 type="text"
// //                 value={formData.github || ""}
// //                 onChange={(e) => handleFormChange("github", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Cohort</label>
// //               <input
// //                 type="text"
// //                 value={formData.cohort || ""}
// //                 onChange={(e) => handleFormChange("cohort", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Specialty
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.specialty || ""}
// //                 onChange={(e) => handleFormChange("specialty", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "daysOfLearning":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Completed Days
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.completedDays || ""}
// //                 onChange={(e) =>
// //                   handleFormChange("completedDays", e.target.value)
// //                 }
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Total Days
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.totalDays || ""}
// //                 onChange={(e) => handleFormChange("totalDays", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Activities (JSON format)
// //               </label>
// //               <textarea
// //                 value={
// //                   formData.activities ||
// //                   '[{"day":1,"content":"","timestamp":""}]'
// //                 }
// //                 onChange={(e) => handleFormChange("activities", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "classMaterial":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Week</label>
// //               <input
// //                 type="number"
// //                 value={formData.week || ""}
// //                 onChange={(e) => handleFormChange("week", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Topics (comma-separated)
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.topics || ""}
// //                 onChange={(e) => handleFormChange("topics", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Resources
// //               </label>
// //               <input
// //                 type="number"
// //                 value={formData.resources || ""}
// //                 onChange={(e) => handleFormChange("resources", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Files (JSON format)
// //               </label>
// //               <textarea
// //                 value={formData.files || '[{"name":"","type":"PDF","size":""}]'}
// //                 onChange={(e) => handleFormChange("files", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "post":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Author</label>
// //               <input
// //                 type="text"
// //                 value={formData.author || "Admin Team"}
// //                 onChange={(e) => handleFormChange("author", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Content
// //               </label>
// //               <textarea
// //                 value={formData.content || ""}
// //                 onChange={(e) => handleFormChange("content", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                 rows="4"
// //               />
// //             </div>
// //           </div>
// //         );
// //       case "session":
// //         return (
// //           <div className="space-y-4">
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 value={formData.title || ""}
// //                 onChange={(e) => handleFormChange("title", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Instructor
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.instructor || ""}
// //                 onChange={(e) => handleFormChange("instructor", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Date</label>
// //               <input
// //                 type="date"
// //                 value={formData.date || ""}
// //                 onChange={(e) => handleFormChange("date", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Time</label>
// //               <input
// //                 type="time"
// //                 value={formData.time || ""}
// //                 onChange={(e) => handleFormChange("time", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">
// //                 Duration
// //               </label>
// //               <input
// //                 type="text"
// //                 value={formData.duration || ""}
// //                 onChange={(e) => handleFormChange("duration", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-gray-400 text-sm mb-2">Status</label>
// //               <select
// //                 value={formData.status || "pending"}
// //                 onChange={(e) => handleFormChange("status", e.target.value)}
// //                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //               >
// //                 <option value="confirmed">Confirmed</option>
// //                 <option value="pending">Pending</option>
// //               </select>
// //             </div>
// //           </div>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="space-y-6 bg-gray-900 min-h-screen p-6">
// //       {/* Dashboard Header */}
// //       <div className="flex items-center justify-between flex-wrap gap-4">
// //         <div>
// //           <h1 className="text-white text-3xl font-bold">
// //             Administrator Dashboard
// //           </h1>
// //           <p className="text-gray-400 mt-2">
// //             Manage students, assignments, and system settings
// //           </p>
// //         </div>
// //         <div className="flex items-center space-x-3 flex-wrap gap-2">
// //           <button
// //             className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2"
// //             aria-label="Notifications"
// //           >
// //             <Bell className="w-4 h-4" />
// //             <span>Notifications</span>
// //           </button>
// //           <select
// //             value={selectedForm}
// //             onChange={(e) => {
// //               setSelectedForm(e.target.value);
// //               setFormData({});
// //             }}
// //             className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
// //             aria-label="Select content type"
// //           >
// //             <option value="">Select Content Type</option>
// //             <option value="announcement">New Announcement</option>
// //             <option value="assignment">New Assignment</option>
// //             <option value="event">New Event</option>
// //             <option value="workReadyResource">New Work Ready Resource</option>
// //             <option value="roadmapItem">New Roadmap Item</option>
// //             <option value="resource">New Resource</option>
// //             <option value="project">New Project</option>
// //             <option value="profile">Update Profile</option>
// //             <option value="grade">New Grade</option>
// //             <option value="exercise">New Exercise</option>
// //             <option value="directoryEntry">New Directory Entry</option>
// //             <option value="daysOfLearning">Update Days of Learning</option>
// //             <option value="classMaterial">New Class Material</option>
// //             <option value="post">New Campus Connect Post</option>
// //             <option value="session">New Session</option>
// //           </select>
// //           <button
// //             className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2"
// //             aria-label="Settings"
// //           >
// //             <Settings className="w-4 h-4" />
// //             <span>Settings</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Form Modal */}
// //       {selectedForm && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="text-white text-2xl font-bold">
// //                 {selectedForm === "announcement"
// //                   ? "New Announcement"
// //                   : selectedForm === "assignment"
// //                   ? "New Assignment"
// //                   : selectedForm === "event"
// //                   ? formData.id
// //                     ? "Edit Event"
// //                     : "New Event"
// //                   : selectedForm === "workReadyResource"
// //                   ? "New Work Ready Resource"
// //                   : selectedForm === "roadmapItem"
// //                   ? "New Roadmap Item"
// //                   : selectedForm === "resource"
// //                   ? "New Resource"
// //                   : selectedForm === "project"
// //                   ? "New Project"
// //                   : selectedForm === "profile"
// //                   ? "Update Profile"
// //                   : selectedForm === "grade"
// //                   ? "New Grade"
// //                   : selectedForm === "exercise"
// //                   ? "New Exercise"
// //                   : selectedForm === "directoryEntry"
// //                   ? "New Directory Entry"
// //                   : selectedForm === "daysOfLearning"
// //                   ? "Update Days of Learning"
// //                   : selectedForm === "classMaterial"
// //                   ? "New Class Material"
// //                   : selectedForm === "post"
// //                   ? "New Campus Connect Post"
// //                   : "New Session"}
// //               </h2>
// //               <button
// //                 onClick={() => {
// //                   setSelectedForm("");
// //                   setFormData({});
// //                 }}
// //                 className="text-gray-400 hover:text-white"
// //                 aria-label="Close form modal"
// //               >
// //                 <X className="w-6 h-6" />
// //               </button>
// //             </div>
// //             <form onSubmit={handleFormSubmit}>{renderForm()}</form>
// //             <div className="flex justify-end space-x-3 mt-6">
// //               <button
// //                 onClick={() => {
// //                   setSelectedForm("");
// //                   setFormData({});
// //                 }}
// //                 className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="submit"
// //                 form="form"
// //                 className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold"
// //               >
// //                 Submit
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Stats Section */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         {stats.map((stat, index) => (
// //           <div
// //             key={index}
// //             className="bg-gray-800 rounded-lg p-6 border border-gray-700"
// //           >
// //             <div className="flex items-center justify-between mb-3">
// //               <StatIcon icon={stat.icon} color={stat.color} />
// //               <TrendingUp className="w-4 h-4 text-gray-400" />
// //             </div>
// //             <h3 className="text-white text-3xl font-bold mb-1">{stat.value}</h3>
// //             <p className="text-gray-400 text-sm">{stat.label}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Tab Navigation */}
// //       <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
// //         <div className="flex space-x-2 overflow-x-auto">
// //           <button
// //             onClick={() => setActiveTab("overview")}
// //             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
// //               activeTab === "overview"
// //                 ? "bg-yellow-500 text-gray-900"
// //                 : "text-gray-400 hover:text-white"
// //             }`}
// //             aria-label="Overview Tab"
// //           >
// //             Overview
// //           </button>
// //           {/* Add other tabs as needed */}
// //         </div>
// //       </div>

// //       {/* Overview Tab Content */}
// //       {activeTab === "overview" && (
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
// //             <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
// //               <Calendar className="w-5 h-5 text-yellow-500" />
// //               <span>Upcoming Events</span>
// //             </h3>
// //             <div className="space-y-3">
// //               {events.map((event) => (
// //                 <div
// //                   key={event.id}
// //                   className="bg-gray-900 rounded-lg p-4 border border-gray-700"
// //                 >
// //                   <div className="flex items-center justify-between">
// //                     <div>
// //                       <h4 className="text-white font-semibold">
// //                         {event.event}
// //                       </h4>
// //                       <p className="text-gray-400 text-sm">
// //                         {event.date} at {event.time}
// //                       </p>
// //                     </div>
// //                     <div className="flex items-center space-x-2">
// //                       <button
// //                         onClick={() => handleEditEvent(event)}
// //                         className="text-yellow-500 hover:text-yellow-400"
// //                         aria-label={`Edit event ${event.event}`}
// //                       >
// //                         <Edit className="w-4 h-4" />
// //                       </button>
// //                       <button
// //                         onClick={() => deleteEvent(event.id)}
// //                         className="text-red-500 hover:text-red-400"
// //                         aria-label={`Delete event ${event.event}`}
// //                       >
// //                         <Trash2 className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             <button
// //               onClick={() => {
// //                 setSelectedForm("event");
// //                 setFormData({ id: null, event: "", date: "", time: "" });
// //               }}
// //               className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
// //               aria-label="Add Event"
// //             >
// //               Add Event
// //             </button>
// //           </div>
// //           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
// //             <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
// //               <Bell className="w-5 h-5 text-yellow-500" />
// //               <span>Recent Activity</span>
// //             </h3>
// //             <div className="space-y-3">{/* ... activity items */}</div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Students Tab Content */}
// //       {activeTab === "students" && (
// //         <div className="space-y-6">
// //           <div className="flex items-center space-x-4">
// //             <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
// //               <div className="flex items-center space-x-2">
// //                 <Search className="w-5 h-5 text-gray-400" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search students..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
// //                   aria-label="Search students"
// //                 />
// //               </div>
// //             </div>
// //             <button
// //               className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
// //               aria-label="Add Student"
// //             >
// //               <UserPlus className="w-5 h-5" />
// //               <span>Add Student</span>
// //             </button>
// //           </div>
// //           <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
// //             <table className="w-full">{/* ... student table */}</table>
// //           </div>
// //         </div>
// //       )}

// //       {/* Pending Actions Tab Content */}
// //       {activeTab === "actions" && (
// //         <div className="space-y-4">
// //           {pendingActions.length === 0 ? (
// //             <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
// //               <p className="text-gray-400 text-lg">No pending actions</p>
// //             </div>
// //           ) : (
// //             pendingActions.map((action) => (
// //               <div
// //                 key={action.id}
// //                 className="bg-gray-800 rounded-lg p-6 border border-gray-700"
// //               >
// //                 {/* ... pending action items */}
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       )}

// //       {/* Assignments Tab Content */}
// //       {activeTab === "assignments" && (
// //         <div className="space-y-6">
// //           <div className="flex items-center space-x-4">
// //             <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
// //               <div className="flex items-center space-x-2">
// //                 <Search className="w-5 h-5 text-gray-400" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search assignments..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
// //                   aria-label="Search assignments"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //           <div className="space-y-4">
// //             {filteredAssignments.map((assignment) => (
// //               <div
// //                 key={assignment.id}
// //                 className="bg-gray-800 rounded-lg p-6 border border-gray-700"
// //               >
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div className="flex-1">
// //                     <h3 className="text-white text-lg font-semibold mb-2">
// //                       {assignment.title}
// //                     </h3>
// //                     {assignment.description && (
// //                       <p className="text-gray-400 text-sm mb-3">
// //                         {assignment.description}
// //                       </p>
// //                     )}
// //                     <div className="flex items-center space-x-4 text-sm flex-wrap">
// //                       <span className="flex items-center space-x-1 text-gray-400">
// //                         <Calendar className="w-4 h-4" />
// //                         <span>Due: {assignment.dueDate}</span>
// //                       </span>
// //                       <span className="flex items-center space-x-1 text-gray-400">
// //                         <Award className="w-4 h-4" />
// //                         <span>{assignment.points} points</span>
// //                       </span>
// //                     </div>
// //                     {assignment.status === "submitted" && (
// //                       <div className="mt-3">
// //                         <label className="block text-gray-400 text-sm mb-2">
// //                           Grade
// //                         </label>
// //                         <input
// //                           type="number"
// //                           value={formData[assignment.id] || ""}
// //                           onChange={(e) =>
// //                             handleGradeChange(assignment.id, e.target.value)
// //                           }
// //                           className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
// //                           placeholder="Enter grade"
// //                         />
// //                         <button
// //                           onClick={() => handleGradeSubmit(assignment.id)}
// //                           className="ml-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
// //                         >
// //                           Submit Grade
// //                         </button>
// //                       </div>
// //                     )}
// //                     {assignment.status === "graded" && (
// //                       <div className="mt-3">
// //                         <p className="text-gray-300 text-sm font-semibold">
// //                           Grade: {assignment.grade}/{assignment.points}
// //                         </p>
// //                       </div>
// //                     )}
// //                   </div>
// //                   <span
// //                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
// //                       assignment.status === "graded"
// //                         ? "bg-green-500 text-white"
// //                         : assignment.status === "submitted"
// //                         ? "bg-blue-500 text-white"
// //                         : "bg-yellow-500 text-gray-900"
// //                     }`}
// //                   >
// //                     {assignment.status.toUpperCase()}
// //                   </span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Administrator;




// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   BookOpen,
//   TrendingUp,
//   Bell,
//   Calendar,
//   Search,
//   Edit,
//   Trash2,
//   MoreVertical,
//   UserPlus,
//   Settings,
//   Award,
//   CheckCircle,
//   X,
// } from "lucide-react";
// import useManageStore from "./../Store/useManageStore";

// const Administrator = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedForm, setSelectedForm] = useState("");
//   const [formData, setFormData] = useState({});
//   const {
//     announcements,
//     addAnnouncement,
//     events,
//     addEvent,
//     updateEvent,
//     deleteEvent,
//     assignments,
//     addAssignment,
//     updateAssignment,
//     addWorkReadyResource,
//     addRoadmapItem,
//     addResource,
//     addProject,
//     updateProfile,
//     addGrade,
//     addExercise,
//     addDirectoryEntry,
//     updateDaysOfLearning,
//     addClassMaterial,
//     addPost,
//     addSession,
//   } = useManageStore();

//   const [recentStudents] = useState([
//     {
//       id: 1,
//       name: "Julius Dagana",
//       email: "julius@example.com",
//       cohort: "2024-B",
//       status: "active",
//       attendance: 92,
//     },
//   ]);

//   const stats = [
//     { label: "Total Students", value: "156", icon: Users, color: "yellow" },
//     { label: "Active Courses", value: "8", icon: BookOpen, color: "blue" },
//   ];

//   const pendingActions = assignments
//     .filter((assignment) => assignment.status === "submitted")
//     .map((assignment) => ({
//       id: assignment.id,
//       type: "Assignment Review",
//       student:
//         recentStudents.find((s) => s.id === assignment.studentId)?.name ||
//         "Unknown",
//       description: assignment.title,
//       priority: "medium",
//     }));

//   const StatIcon = ({ icon: Icon, color }) => (
//     <Icon
//       className={`w-8 h-8 ${
//         color === "yellow"
//           ? "text-yellow-500"
//           : color === "blue"
//           ? "text-blue-500"
//           : color === "green"
//           ? "text-green-500"
//           : "text-purple-500"
//       }`}
//     />
//   );

//   const handleFormChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const newId = (arr) =>
//       arr.length ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
//     switch (selectedForm) {
//       case "announcement":
//         addAnnouncement({
//           id: newId(announcements),
//           title: formData.title || "",
//           content: formData.content || "",
//           date: new Date().toISOString().split("T")[0],
//           priority: formData.priority || "medium",
//           author: formData.author || "Admin Team",
//         });
//         break;
//       case "assignment":
//         if (
//           !formData.title ||
//           !formData.dueDate ||
//           !formData.points ||
//           !formData.studentId
//         ) {
//           alert("Please fill in all required fields.");
//           return;
//         }
//         const points = parseInt(formData.points);
//         if (isNaN(points) || points <= 0) {
//           alert("Please enter a valid number of points.");
//           return;
//         }
//         addAssignment({
//           id: newId(assignments),
//           title: formData.title,
//           description: formData.description || "",
//           dueDate: formData.dueDate,
//           points,
//           studentId: parseInt(formData.studentId),
//           status: "pending",
//         });
//         break;
//       case "event":
//         addEvent({
//           id: formData.id || newId(events),
//           event: formData.event || "",
//           date: formData.date || "",
//           time: formData.time || "",
//         });
//         break;
//       case "workReadyResource":
//         addWorkReadyResource({
//           id: newId([]),
//           title: formData.title || "",
//           description: formData.description || "",
//           type: formData.type || "Document",
//           status: formData.status || "available",
//         });
//         break;
//       case "roadmapItem":
//         addRoadmapItem({
//           id: newId([]),
//           phase: formData.phase || "",
//           status: formData.status || "upcoming",
//           weeks: formData.weeks
//             ? JSON.parse(formData.weeks)
//             : [{ week: 1, topic: "", completed: false }],
//         });
//         break;
//       case "resource":
//         addResource({
//           id: newId([]),
//           title: formData.title || "",
//           type: formData.type || "Article",
//           category: formData.category || "",
//           description: formData.description || "",
//           link: formData.link || "#",
//         });
//         break;
//       case "project":
//         addProject({
//           id: newId([]),
//           title: formData.title || "",
//           week: parseInt(formData.week) || 1,
//           status: formData.status || "in-progress",
//           technologies: formData.technologies
//             ? formData.technologies.split(",")
//             : [],
//         });
//         break;
//       case "profile":
//         updateProfile({
//           name: formData.name || "",
//           email: formData.email || "",
//           phone: formData.phone || "",
//           location: formData.location || "",
//           github: formData.github || "",
//           linkedin: formData.linkedin || "",
//           bio: formData.bio || "",
//           cohort: formData.cohort || "",
//           startDate: formData.startDate || "",
//         });
//         break;
//       case "grade":
//         addGrade({
//           id: newId([]),
//           category: formData.category || "",
//           earned: parseFloat(formData.earned) || 0,
//           total: parseFloat(formData.total) || 0,
//           percentage: (
//             (parseFloat(formData.earned) / parseFloat(formData.total)) * 100
//           ).toFixed(1),
//         });
//         break;
//       case "exercise":
//         addExercise({
//           id: newId([]),
//           title: formData.title || "",
//           points: parseInt(formData.points) || 0,
//           completed: formData.completed === "true",
//         });
//         break;
//       case "directoryEntry":
//         addDirectoryEntry({
//           id: newId([]),
//           name: formData.name || "",
//           role: formData.role || "Student",
//           email: formData.email || "",
//           github: formData.github || "",
//           cohort: formData.cohort || "",
//           specialty: formData.specialty || "",
//         });
//         break;
//       case "daysOfLearning":
//         updateDaysOfLearning({
//           completedDays: parseInt(formData.completedDays) || 0,
//           totalDays: parseInt(formData.totalDays) || 100,
//           activities: formData.activities
//             ? JSON.parse(formData.activities)
//             : [],
//         });
//         break;
//       case "classMaterial":
//         addClassMaterial({
//           id: newId([]),
//           week: parseInt(formData.week) || 1,
//           title: formData.title || "",
//           topics: formData.topics ? formData.topics.split(",") : [],
//           resources: parseInt(formData.resources) || 0,
//           files: formData.files
//             ? JSON.parse(formData.files)
//             : [{ name: "", type: "PDF", size: "" }],
//         });
//         break;
//       case "post":
//         addPost({
//           id: newId([]),
//           author: formData.author || "Admin Team",
//           timestamp: new Date().toISOString(),
//           content: formData.content || "",
//           likes: 0,
//           comments: 0,
//         });
//         break;
//       case "session":
//         addSession({
//           id: newId([]),
//           title: formData.title || "",
//           instructor: formData.instructor || "",
//           date: formData.date || "",
//           time: formData.time || "",
//           duration: formData.duration || "30 min",
//           status: formData.status || "pending",
//         });
//         break;
//       default:
//         break;
//     }
//     setFormData({});
//     setSelectedForm("");
//   };

//   const handleEditEvent = (event) => {
//     setFormData({
//       id: event.id,
//       event: event.event,
//       date: event.date,
//       time: event.time,
//     });
//     setSelectedForm("event");
//   };

//   const handleGradeChange = (assignmentId, value) => {
//     setFormData((prev) => ({ ...prev, [assignmentId]: value }));
//   };

//   const handleGradeSubmit = (assignmentId) => {
//     const grade = parseFloat(formData[assignmentId]);
//     const assignment = assignments.find((a) => a.id === assignmentId);
//     if (isNaN(grade) || grade < 0 || grade > assignment.points) {
//       alert("Please enter a valid grade between 0 and the maximum points.");
//       return;
//     }
//     updateAssignment(assignmentId, { status: "graded", grade });
//     setFormData((prev) => ({ ...prev, [assignmentId]: "" }));
//   };

//   const filteredStudents = recentStudents.filter(
//     (student) =>
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredAssignments =
//     activeTab === "assignments"
//       ? assignments.filter(
//           (a) =>
//             a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             recentStudents
//               .find((s) => s.id === a.studentId)
//               ?.name.toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         )
//       : assignments;

//   const renderForm = () => {
//     switch (selectedForm) {
//       case "announcement":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Content
//               </label>
//               <textarea
//                 value={formData.content || ""}
//                 onChange={(e) => handleFormChange("content", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Priority
//               </label>
//               <select
//                 value={formData.priority || "medium"}
//                 onChange={(e) => handleFormChange("priority", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Author</label>
//               <input
//                 type="text"
//                 value={formData.author || "Admin Team"}
//                 onChange={(e) => handleFormChange("author", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "assignment":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description || ""}
//                 onChange={(e) =>
//                   handleFormChange("description", e.target.value)
//                 }
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Due Date
//               </label>
//               <input
//                 type="date"
//                 value={formData.dueDate || ""}
//                 onChange={(e) => handleFormChange("dueDate", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Points</label>
//               <input
//                 type="number"
//                 value={formData.points || ""}
//                 onChange={(e) => handleFormChange("points", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Student ID
//               </label>
//               <input
//                 type="number"
//                 value={formData.studentId || ""}
//                 onChange={(e) => handleFormChange("studentId", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "event":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Event</label>
//               <input
//                 type="text"
//                 value={formData.event || ""}
//                 onChange={(e) => handleFormChange("event", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Date</label>
//               <input
//                 type="date"
//                 value={formData.date || ""}
//                 onChange={(e) => handleFormChange("date", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Time</label>
//               <input
//                 type="time"
//                 value={formData.time || ""}
//                 onChange={(e) => handleFormChange("time", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "workReadyResource":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description || ""}
//                 onChange={(e) =>
//                   handleFormChange("description", e.target.value)
//                 }
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Type</label>
//               <select
//                 value={formData.type || "Document"}
//                 onChange={(e) => handleFormChange("type", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="Document">Document</option>
//                 <option value="Session">Session</option>
//                 <option value="Workshop">Workshop</option>
//                 <option value="Guide">Guide</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Status</label>
//               <select
//                 value={formData.status || "available"}
//                 onChange={(e) => handleFormChange("status", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="available">Available</option>
//                 <option value="upcoming">Upcoming</option>
//               </select>
//             </div>
//           </div>
//         );
//       case "roadmapItem":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Phase</label>
//               <input
//                 type="text"
//                 value={formData.phase || ""}
//                 onChange={(e) => handleFormChange("phase", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Status</label>
//               <select
//                 value={formData.status || "upcoming"}
//                 onChange={(e) => handleFormChange("status", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="completed">Completed</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="upcoming">Upcoming</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Weeks (JSON format)
//               </label>
//               <textarea
//                 value={
//                   formData.weeks || '[{"week":1,"topic":"","completed":false}]'
//                 }
//                 onChange={(e) => handleFormChange("weeks", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//           </div>
//         );
//       case "resource":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Type</label>
//               <select
//                 value={formData.type || "Article"}
//                 onChange={(e) => handleFormChange("type", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="Video">Video</option>
//                 <option value="Article">Article</option>
//                 <option value="eBook">eBook</option>
//                 <option value="Documentation">Documentation</option>
//                 <option value="Tutorial">Tutorial</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 value={formData.category || ""}
//                 onChange={(e) => handleFormChange("category", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description || ""}
//                 onChange={(e) =>
//                   handleFormChange("description", e.target.value)
//                 }
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Link</label>
//               <input
//                 type="text"
//                 value={formData.link || ""}
//                 onChange={(e) => handleFormChange("link", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "project":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Week</label>
//               <input
//                 type="number"
//                 value={formData.week || ""}
//                 onChange={(e) => handleFormChange("week", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Status</label>
//               <select
//                 value={formData.status || "in-progress"}
//                 onChange={(e) => handleFormChange("status", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="completed">Completed</option>
//                 <option value="in-progress">In Progress</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Technologies (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 value={formData.technologies || ""}
//                 onChange={(e) =>
//                   handleFormChange("technologies", e.target.value)
//                 }
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "profile":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.name || ""}
//                 onChange={(e) => handleFormChange("name", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Email</label>
//               <input
//                 type="email"
//                 value={formData.email || ""}
//                 onChange={(e) => handleFormChange("email", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Phone</label>
//               <input
//                 type="tel"
//                 value={formData.phone || ""}
//                 onChange={(e) => handleFormChange("phone", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Location
//               </label>
//               <input
//                 type="text"
//                 value={formData.location || ""}
//                 onChange={(e) => handleFormChange("location", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">GitHub</label>
//               <input
//                 type="text"
//                 value={formData.github || ""}
//                 onChange={(e) => handleFormChange("github", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 LinkedIn
//               </label>
//               <input
//                 type="text"
//                 value={formData.linkedin || ""}
//                 onChange={(e) => handleFormChange("linkedin", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Bio</label>
//               <textarea
//                 value={formData.bio || ""}
//                 onChange={(e) => handleFormChange("bio", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Cohort</label>
//               <input
//                 type="text"
//                 value={formData.cohort || ""}
//                 onChange={(e) => handleFormChange("cohort", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Start Date
//               </label>
//               <input
//                 type="text"
//                 value={formData.startDate || ""}
//                 onChange={(e) => handleFormChange("startDate", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "grade":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Category
//               </label>
//               <input
//                 type="text"
//                 value={formData.category || ""}
//                 onChange={(e) => handleFormChange("category", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Earned Points
//               </label>
//               <input
//                 type="number"
//                 value={formData.earned || ""}
//                 onChange={(e) => handleFormChange("earned", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Total Points
//               </label>
//               <input
//                 type="number"
//                 value={formData.total || ""}
//                 onChange={(e) => handleFormChange("total", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "exercise":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Points</label>
//               <input
//                 type="number"
//                 value={formData.points || ""}
//                 onChange={(e) => handleFormChange("points", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Completed
//               </label>
//               <select
//                 value={formData.completed || "false"}
//                 onChange={(e) => handleFormChange("completed", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="true">True</option>
//                 <option value="false">False</option>
//               </select>
//             </div>
//           </div>
//         );
//       case "directoryEntry":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Name</label>
//               <input
//                 type="text"
//                 value={formData.name || ""}
//                 onChange={(e) => handleFormChange("name", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Role</label>
//               <select
//                 value={formData.role || "Student"}
//                 onChange={(e) => handleFormChange("role", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="Student">Student</option>
//                 <option value="Instructor">Instructor</option>
//                 <option value="Teaching Assistant">Teaching Assistant</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Email</label>
//               <input
//                 type="email"
//                 value={formData.email || ""}
//                 onChange={(e) => handleFormChange("email", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">GitHub</label>
//               <input
//                 type="text"
//                 value={formData.github || ""}
//                 onChange={(e) => handleFormChange("github", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Cohort</label>
//               <input
//                 type="text"
//                 value={formData.cohort || ""}
//                 onChange={(e) => handleFormChange("cohort", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Specialty
//               </label>
//               <input
//                 type="text"
//                 value={formData.specialty || ""}
//                 onChange={(e) => handleFormChange("specialty", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//           </div>
//         );
//       case "daysOfLearning":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Completed Days
//               </label>
//               <input
//                 type="number"
//                 value={formData.completedDays || ""}
//                 onChange={(e) =>
//                   handleFormChange("completedDays", e.target.value)
//                 }
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Total Days
//               </label>
//               <input
//                 type="number"
//                 value={formData.totalDays || ""}
//                 onChange={(e) => handleFormChange("totalDays", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Activities (JSON format)
//               </label>
//               <textarea
//                 value={
//                   formData.activities ||
//                   '[{"day":1,"content":"","timestamp":""}]'
//                 }
//                 onChange={(e) => handleFormChange("activities", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//           </div>
//         );
//       case "classMaterial":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Week</label>
//               <input
//                 type="number"
//                 value={formData.week || ""}
//                 onChange={(e) => handleFormChange("week", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Topics (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 value={formData.topics || ""}
//                 onChange={(e) => handleFormChange("topics", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Resources
//               </label>
//               <input
//                 type="number"
//                 value={formData.resources || ""}
//                 onChange={(e) => handleFormChange("resources", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Files (JSON format)
//               </label>
//               <textarea
//                 value={formData.files || '[{"name":"","type":"PDF","size":""}]'}
//                 onChange={(e) => handleFormChange("files", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//           </div>
//         );
//       case "post":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Author</label>
//               <input
//                 type="text"
//                 value={formData.author || "Admin Team"}
//                 onChange={(e) => handleFormChange("author", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Content
//               </label>
//               <textarea
//                 value={formData.content || ""}
//                 onChange={(e) => handleFormChange("content", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//               />
//             </div>
//           </div>
//         );
//       case "session":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Title</label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Instructor
//               </label>
//               <input
//                 type="text"
//                 value={formData.instructor || ""}
//                 onChange={(e) => handleFormChange("instructor", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Date</label>
//               <input
//                 type="date"
//                 value={formData.date || ""}
//                 onChange={(e) => handleFormChange("date", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Time</label>
//               <input
//                 type="time"
//                 value={formData.time || ""}
//                 onChange={(e) => handleFormChange("time", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Duration
//               </label>
//               <input
//                 type="text"
//                 value={formData.duration || ""}
//                 onChange={(e) => handleFormChange("duration", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Status</label>
//               <select
//                 value={formData.status || "pending"}
//                 onChange={(e) => handleFormChange("status", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//               >
//                 <option value="confirmed">Confirmed</option>
//                 <option value="pending">Pending</option>
//               </select>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6 bg-gray-900 min-h-screen p-6">
//       {/* Dashboard Header */}
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="text-white text-3xl font-bold">
//             Administrator Dashboard
//           </h1>
//           <p className="text-gray-400 mt-2">
//             Manage students, assignments, and system settings
//           </p>
//         </div>
//         <div className="flex items-center space-x-3 flex-wrap gap-2">
//           <button
//             className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2"
//             aria-label="Notifications"
//           >
//             <Bell className="w-4 h-4" />
//             <span>Notifications</span>
//           </button>
//           <select
//             value={selectedForm}
//             onChange={(e) => {
//               setSelectedForm(e.target.value);
//               setFormData({});
//             }}
//             className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
//             aria-label="Select content type"
//           >
//             <option value="">Select Content Type</option>
//             <option value="announcement">New Announcement</option>
//             <option value="assignment">New Assignment</option>
//             <option value="event">New Event</option>
//             <option value="workReadyResource">New Work Ready Resource</option>
//             <option value="roadmapItem">New Roadmap Item</option>
//             <option value="resource">New Resource</option>
//             <option value="project">New Project</option>
//             <option value="profile">Update Profile</option>
//             <option value="grade">New Grade</option>
//             <option value="exercise">New Exercise</option>
//             <option value="directoryEntry">New Directory Entry</option>
//             <option value="daysOfLearning">Update Days of Learning</option>
//             <option value="classMaterial">New Class Material</option>
//             <option value="post">New Campus Connect Post</option>
//             <option value="session">New Session</option>
//           </select>
//           <button
//             className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2"
//             aria-label="Settings"
//           >
//             <Settings className="w-4 h-4" />
//             <span>Settings</span>
//           </button>
//         </div>
//       </div>

//       {/* Form Modal */}
//       {selectedForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-white text-2xl font-bold">
//                 {selectedForm === "announcement"
//                   ? "New Announcement"
//                   : selectedForm === "assignment"
//                   ? "New Assignment"
//                   : selectedForm === "event"
//                   ? formData.id
//                     ? "Edit Event"
//                     : "New Event"
//                   : selectedForm === "workReadyResource"
//                   ? "New Work Ready Resource"
//                   : selectedForm === "roadmapItem"
//                   ? "New Roadmap Item"
//                   : selectedForm === "resource"
//                   ? "New Resource"
//                   : selectedForm === "project"
//                   ? "New Project"
//                   : selectedForm === "profile"
//                   ? "Update Profile"
//                   : selectedForm === "grade"
//                   ? "New Grade"
//                   : selectedForm === "exercise"
//                   ? "New Exercise"
//                   : selectedForm === "directoryEntry"
//                   ? "New Directory Entry"
//                   : selectedForm === "daysOfLearning"
//                   ? "Update Days of Learning"
//                   : selectedForm === "classMaterial"
//                   ? "New Class Material"
//                   : selectedForm === "post"
//                   ? "New Campus Connect Post"
//                   : "New Session"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setSelectedForm("");
//                   setFormData({});
//                 }}
//                 className="text-gray-400 hover:text-white"
//                 aria-label="Close form modal"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <form id="content-form" onSubmit={handleFormSubmit}>
//               {renderForm()}
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSelectedForm("");
//                     setFormData({});
//                   }}
//                   className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   form="content-form"
//                   className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <StatIcon icon={stat.icon} color={stat.color} />
//               <TrendingUp className="w-4 h-4 text-gray-400" />
//             </div>
//             <h3 className="text-white text-3xl font-bold mb-1">{stat.value}</h3>
//             <p className="text-gray-400 text-sm">{stat.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Tab Navigation */}
//       <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
//         <div className="flex space-x-2 overflow-x-auto">
//           <button
//             onClick={() => setActiveTab("overview")}
//             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
//               activeTab === "overview"
//                 ? "bg-yellow-500 text-gray-900"
//                 : "text-gray-400 hover:text-white"
//             }`}
//             aria-label="Overview Tab"
//           >
//             Overview
//           </button>
//           {/* Add other tabs as needed */}
//         </div>
//       </div>

//       {/* Overview Tab Content */}
//       {activeTab === "overview" && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
//               <Calendar className="w-5 h-5 text-yellow-500" />
//               <span>Upcoming Events</span>
//             </h3>
//             <div className="space-y-3">
//               {events.map((event) => (
//                 <div
//                   key={event.id}
//                   className="bg-gray-900 rounded-lg p-4 border border-gray-700"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="text-white font-semibold">
//                         {event.event}
//                       </h4>
//                       <p className="text-gray-400 text-sm">
//                         {event.date} at {event.time}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handleEditEvent(event)}
//                         className="text-yellow-500 hover:text-yellow-400"
//                         aria-label={`Edit event ${event.event}`}
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => deleteEvent(event.id)}
//                         className="text-red-500 hover:text-red-400"
//                         aria-label={`Delete event ${event.event}`}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedForm("event");
//                 setFormData({ id: null, event: "", date: "", time: "" });
//               }}
//               className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
//               aria-label="Add Event"
//             >
//               Add Event
//             </button>
//           </div>
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
//               <Bell className="w-5 h-5 text-yellow-500" />
//               <span>Recent Activity</span>
//             </h3>
//             <div className="space-y-3">{/* ... activity items */}</div>
//           </div>
//         </div>
//       )}

//       {/* Students Tab Content */}
//       {activeTab === "students" && (
//         <div className="space-y-6">
//           <div className="flex items-center space-x-4">
//             <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <div className="flex items-center space-x-2">
//                 <Search className="w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search students..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
//                   aria-label="Search students"
//                 />
//               </div>
//             </div>
//             <button
//               className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
//               aria-label="Add Student"
//             >
//               <UserPlus className="w-5 h-5" />
//               <span>Add Student</span>
//             </button>
//           </div>
//           <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
//             <table className="w-full">{/* ... student table */}</table>
//           </div>
//         </div>
//       )}

//       {/* Pending Actions Tab Content */}
//       {activeTab === "actions" && (
//         <div className="space-y-4">
//           {pendingActions.length === 0 ? (
//             <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
//               <p className="text-gray-400 text-lg">No pending actions</p>
//             </div>
//           ) : (
//             pendingActions.map((action) => (
//               <div
//                 key={action.id}
//                 className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//               >
//                 {/* ... pending action items */}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Assignments Tab Content */}
//       {activeTab === "assignments" && (
//         <div className="space-y-6">
//           <div className="flex items-center space-x-4">
//             <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
//               <div className="flex items-center space-x-2">
//                 <Search className="w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search assignments..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
//                   aria-label="Search assignments"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="space-y-4">
//             {filteredAssignments.map((assignment) => (
//               <div
//                 key={assignment.id}
//                 className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-white text-lg font-semibold mb-2">
//                       {assignment.title}
//                     </h3>
//                     {assignment.description && (
//                       <p className="text-gray-400 text-sm mb-3">
//                         {assignment.description}
//                       </p>
//                     )}
//                     <div className="flex items-center space-x-4 text-sm flex-wrap">
//                       <span className="flex items-center space-x-1 text-gray-400">
//                         <Calendar className="w-4 h-4" />
//                         <span>Due: {assignment.dueDate}</span>
//                       </span>
//                       <span className="flex items-center space-x-1 text-gray-400">
//                         <Award className="w-4 h-4" />
//                         <span>{assignment.points} points</span>
//                       </span>
//                     </div>
//                     {assignment.status === "submitted" && (
//                       <div className="mt-3">
//                         <label className="block text-gray-400 text-sm mb-2">
//                           Grade
//                         </label>
//                         <input
//                           type="number"
//                           value={formData[assignment.id] || ""}
//                           onChange={(e) =>
//                             handleGradeChange(assignment.id, e.target.value)
//                           }
//                           className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                           placeholder="Enter grade"
//                         />
//                         <button
//                           onClick={() => handleGradeSubmit(assignment.id)}
//                           className="ml-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//                         >
//                           Submit Grade
//                         </button>
//                       </div>
//                     )}
//                     {assignment.status === "graded" && (
//                       <div className="mt-3">
//                         <p className="text-gray-300 text-sm font-semibold">
//                           Grade: {assignment.grade}/{assignment.points}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       assignment.status === "graded"
//                         ? "bg-green-500 text-white"
//                         : assignment.status === "submitted"
//                         ? "bg-blue-500 text-white"
//                         : "bg-yellow-500 text-gray-900"
//                     }`}
//                   >
//                     {assignment.status.toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Administrator;

import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  Bell,
  Calendar,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  Settings,
  Award,
  CheckCircle,
  X,
} from "lucide-react";
import useManageStore from "./../Store/useManageStore";

const Administrator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    assignments,
    addAssignment,
    updateAssignment,
    addWorkReadyResource,
    addRoadmapItem,
    addResource,
    addProject,
    updateProfile,
    addGrade,
    addExercise,
    addDirectoryEntry,
    updateDaysOfLearning,
    addClassMaterial,
    addPost,
    addSession,
  } = useManageStore();

  const [recentStudents] = useState([
    {
      id: 1,
      name: "Julius Dagana",
      email: "julius@example.com",
      cohort: "2024-B",
      status: "active",
      attendance: 92,
    },
  ]);

  const stats = [
    { label: "Total Students", value: "156", icon: Users, color: "yellow" },
    { label: "Active Courses", value: "8", icon: BookOpen, color: "blue" },
  ];

  const pendingActions = assignments
    .filter((assignment) => assignment.status === "submitted")
    .map((assignment) => ({
      id: assignment.id,
      type: "Assignment Review",
      student:
        recentStudents.find((s) => s.id === assignment.studentId)?.name ||
        "Unknown",
      description: assignment.title,
      priority: "medium",
    }));

  const StatIcon = ({ icon: Icon, color }) => (
    <Icon
      className={`w-8 h-8 ${
        color === "yellow"
          ? "text-yellow-500"
          : color === "blue"
          ? "text-blue-500"
          : color === "green"
          ? "text-green-500"
          : "text-purple-500"
      }`}
    />
  );

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = (arr) =>
      arr.length ? Math.max(...arr.map((item) => item.id)) + 1 : 1;

    switch (selectedForm) {
      case "announcement":
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const newAnnouncement = {
          id: newId(announcements),
          title: formData.title,
          content: formData.content,
          date: new Date().toISOString().split("T")[0],
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
        };
        addAnnouncement(newAnnouncement);
        console.log("Added announcement:", newAnnouncement); // Debug log
        break;
      case "assignment":
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        addAssignment({
          id: newId(assignments),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
        });
        break;
      case "event":
        if (!formData.event || !formData.date || !formData.time) {
          alert("Please fill in all required fields (Event, Date, and Time).");
          return;
        }
        if (formData.id) {
          updateEvent(formData.id, {
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
        } else {
          addEvent({
            id: newId(events),
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
        }
        break;
      case "workReadyResource":
        addWorkReadyResource({
          id: newId([]),
          title: formData.title || "",
          description: formData.description || "",
          type: formData.type || "Document",
          status: formData.status || "available",
        });
        break;
      case "roadmapItem":
        addRoadmapItem({
          id: newId([]),
          phase: formData.phase || "",
          status: formData.status || "upcoming",
          weeks: formData.weeks
            ? JSON.parse(formData.weeks)
            : [{ week: 1, topic: "", completed: false }],
        });
        break;
      case "resource":
        addResource({
          id: newId([]),
          title: formData.title || "",
          type: formData.type || "Article",
          category: formData.category || "",
          description: formData.description || "",
          link: formData.link || "#",
        });
        break;
      case "project":
        addProject({
          id: newId([]),
          title: formData.title || "",
          week: parseInt(formData.week) || 1,
          status: formData.status || "in-progress",
          technologies: formData.technologies
            ? formData.technologies.split(",")
            : [],
        });
        break;
      case "profile":
        updateProfile({
          name: formData.name || "",
          email: formData.email || "",
          phone: formData.phone || "",
          location: formData.location || "",
          github: formData.github || "",
          linkedin: formData.linkedin || "",
          bio: formData.bio || "",
          cohort: formData.cohort || "",
          startDate: formData.startDate || "",
        });
        break;
      case "grade":
        addGrade({
          id: newId([]),
          category: formData.category || "",
          earned: parseFloat(formData.earned) || 0,
          total: parseFloat(formData.total) || 0,
          percentage: (
            (parseFloat(formData.earned) / parseFloat(formData.total)) *
            100
          ).toFixed(1),
        });
        break;
      case "exercise":
        addExercise({
          id: newId([]),
          title: formData.title || "",
          points: parseInt(formData.points) || 0,
          completed: formData.completed === "true",
        });
        break;
      case "directoryEntry":
        addDirectoryEntry({
          id: newId([]),
          name: formData.name || "",
          role: formData.role || "Student",
          email: formData.email || "",
          github: formData.github || "",
          cohort: formData.cohort || "",
          specialty: formData.specialty || "",
        });
        break;
      case "daysOfLearning":
        updateDaysOfLearning({
          completedDays: parseInt(formData.completedDays) || 0,
          totalDays: parseInt(formData.totalDays) || 100,
          activities: formData.activities
            ? JSON.parse(formData.activities)
            : [],
        });
        break;
      case "classMaterial":
        addClassMaterial({
          id: newId([]),
          week: parseInt(formData.week) || 1,
          title: formData.title || "",
          topics: formData.topics ? formData.topics.split(",") : [],
          resources: parseInt(formData.resources) || 0,
          files: formData.files
            ? JSON.parse(formData.files)
            : [{ name: "", type: "PDF", size: "" }],
        });
        break;
      case "post":
        addPost({
          id: newId([]),
          author: formData.author || "Admin Team",
          timestamp: new Date().toISOString(),
          content: formData.content || "",
          likes: 0,
          comments: 0,
        });
        break;
      case "session":
        addSession({
          id: newId([]),
          title: formData.title || "",
          instructor: formData.instructor || "",
          date: formData.date || "",
          time: formData.time || "",
          duration: formData.duration || "30 min",
          status: formData.status || "pending",
        });
        break;
      default:
        break;
    }
    setFormData({});
    setSelectedForm("");
  };

  const handleEditEvent = (event) => {
    setFormData({
      id: event.id,
      event: event.event,
      date: event.date,
      time: event.time,
    });
    setSelectedForm("event");
  };

  const handleGradeChange = (assignmentId, value) => {
    setFormData((prev) => ({ ...prev, [assignmentId]: value }));
  };

  const handleGradeSubmit = (assignmentId) => {
    const grade = parseFloat(formData[assignmentId]);
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (isNaN(grade) || grade < 0 || grade > assignment.points) {
      alert("Please enter a valid grade between 0 and the maximum points.");
      return;
    }
    updateAssignment(assignmentId, { status: "graded", grade });
    setFormData((prev) => ({ ...prev, [assignmentId]: "" }));
  };

  const filteredStudents = recentStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments =
    activeTab === "assignments"
      ? assignments.filter(
          (a) =>
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recentStudents
              .find((s) => s.id === a.studentId)
              ?.name.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : assignments;

  const renderForm = () => {
    switch (selectedForm) {
      case "announcement":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Content *
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => handleFormChange("content", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Priority
              </label>
              <select
                value={formData.priority || "medium"}
                onChange={(e) => handleFormChange("priority", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Author</label>
              <input
                type="text"
                value={formData.author || "Admin Team"}
                onChange={(e) => handleFormChange("author", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "assignment":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID *
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "event":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Event *
              </label>
              <input
                type="text"
                value={formData.event || ""}
                onChange={(e) => handleFormChange("event", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date *</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Time *</label>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => handleFormChange("time", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "workReadyResource":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <select
                value={formData.type || "Document"}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="Document">Document</option>
                <option value="Session">Session</option>
                <option value="Workshop">Workshop</option>
                <option value="Guide">Guide</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={formData.status || "available"}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="available">Available</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        );
      case "roadmapItem":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Phase</label>
              <input
                type="text"
                value={formData.phase || ""}
                onChange={(e) => handleFormChange("phase", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={formData.status || "upcoming"}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Weeks (JSON format)
              </label>
              <textarea
                value={
                  formData.weeks || '[{"week":1,"topic":"","completed":false}]'
                }
                onChange={(e) => handleFormChange("weeks", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
          </div>
        );
      case "resource":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Type</label>
              <select
                value={formData.type || "Article"}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="Video">Video</option>
                <option value="Article">Article</option>
                <option value="eBook">eBook</option>
                <option value="Documentation">Documentation</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => handleFormChange("category", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Link</label>
              <input
                type="text"
                value={formData.link || ""}
                onChange={(e) => handleFormChange("link", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "project":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Week</label>
              <input
                type="number"
                value={formData.week || ""}
                onChange={(e) => handleFormChange("week", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={formData.status || "in-progress"}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies || ""}
                onChange={(e) =>
                  handleFormChange("technologies", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleFormChange("location", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">GitHub</label>
              <input
                type="text"
                value={formData.github || ""}
                onChange={(e) => handleFormChange("github", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                value={formData.linkedin || ""}
                onChange={(e) => handleFormChange("linkedin", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Bio</label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) => handleFormChange("bio", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Cohort</label>
              <input
                type="text"
                value={formData.cohort || ""}
                onChange={(e) => handleFormChange("cohort", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Start Date
              </label>
              <input
                type="text"
                value={formData.startDate || ""}
                onChange={(e) => handleFormChange("startDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "grade":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => handleFormChange("category", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Earned Points
              </label>
              <input
                type="number"
                value={formData.earned || ""}
                onChange={(e) => handleFormChange("earned", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Total Points
              </label>
              <input
                type="number"
                value={formData.total || ""}
                onChange={(e) => handleFormChange("total", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "exercise":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Points</label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Completed
              </label>
              <select
                value={formData.completed || "false"}
                onChange={(e) => handleFormChange("completed", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
        );
      case "directoryEntry":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Role</label>
              <select
                value={formData.role || "Student"}
                onChange={(e) => handleFormChange("role", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Teaching Assistant">Teaching Assistant</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">GitHub</label>
              <input
                type="text"
                value={formData.github || ""}
                onChange={(e) => handleFormChange("github", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Cohort</label>
              <input
                type="text"
                value={formData.cohort || ""}
                onChange={(e) => handleFormChange("cohort", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty || ""}
                onChange={(e) => handleFormChange("specialty", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "daysOfLearning":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Completed Days
              </label>
              <input
                type="number"
                value={formData.completedDays || ""}
                onChange={(e) =>
                  handleFormChange("completedDays", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Total Days
              </label>
              <input
                type="number"
                value={formData.totalDays || ""}
                onChange={(e) => handleFormChange("totalDays", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Activities (JSON format)
              </label>
              <textarea
                value={
                  formData.activities ||
                  '[{"day":1,"content":"","timestamp":""}]'
                }
                onChange={(e) => handleFormChange("activities", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
          </div>
        );
      case "classMaterial":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Week</label>
              <input
                type="number"
                value={formData.week || ""}
                onChange={(e) => handleFormChange("week", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topics (comma-separated)
              </label>
              <input
                type="text"
                value={formData.topics || ""}
                onChange={(e) => handleFormChange("topics", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Resources
              </label>
              <input
                type="number"
                value={formData.resources || ""}
                onChange={(e) => handleFormChange("resources", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Files (JSON format)
              </label>
              <textarea
                value={formData.files || '[{"name":"","type":"PDF","size":""}]'}
                onChange={(e) => handleFormChange("files", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
          </div>
        );
      case "post":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Author</label>
              <input
                type="text"
                value={formData.author || "Admin Team"}
                onChange={(e) => handleFormChange("author", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Content
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => handleFormChange("content", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
          </div>
        );
      case "session":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Instructor
              </label>
              <input
                type="text"
                value={formData.instructor || ""}
                onChange={(e) => handleFormChange("instructor", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Time</label>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => handleFormChange("time", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration || ""}
                onChange={(e) => handleFormChange("duration", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={formData.status || "pending"}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold">
            Administrator Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage students, assignments, and system settings
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <select
            value={selectedForm}
            onChange={(e) => {
              setSelectedForm(e.target.value);
              setFormData({});
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            aria-label="Select content type"
          >
            <option value="">Select Content Type</option>
            <option value="announcement">New Announcement</option>
            <option value="assignment">New Assignment</option>
            <option value="event">New Event</option>
            <option value="workReadyResource">New Work Ready Resource</option>
            <option value="roadmapItem">New Roadmap Item</option>
            <option value="resource">New Resource</option>
            <option value="project">New Project</option>
            <option value="profile">Update Profile</option>
            <option value="grade">New Grade</option>
            <option value="exercise">New Exercise</option>
            <option value="directoryEntry">New Directory Entry</option>
            <option value="daysOfLearning">Update Days of Learning</option>
            <option value="classMaterial">New Class Material</option>
            <option value="post">New Campus Connect Post</option>
            <option value="session">New Session</option>
          </select>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">
                {selectedForm === "announcement"
                  ? "New Announcement"
                  : selectedForm === "assignment"
                  ? "New Assignment"
                  : selectedForm === "event"
                  ? formData.id
                    ? "Edit Event"
                    : "New Event"
                  : selectedForm === "workReadyResource"
                  ? "New Work Ready Resource"
                  : selectedForm === "roadmapItem"
                  ? "New Roadmap Item"
                  : selectedForm === "resource"
                  ? "New Resource"
                  : selectedForm === "project"
                  ? "New Project"
                  : selectedForm === "profile"
                  ? "Update Profile"
                  : selectedForm === "grade"
                  ? "New Grade"
                  : selectedForm === "exercise"
                  ? "New Exercise"
                  : selectedForm === "directoryEntry"
                  ? "New Directory Entry"
                  : selectedForm === "daysOfLearning"
                  ? "Update Days of Learning"
                  : selectedForm === "classMaterial"
                  ? "New Class Material"
                  : selectedForm === "post"
                  ? "New Campus Connect Post"
                  : "New Session"}
              </h2>
              <button
                onClick={() => {
                  setSelectedForm("");
                  setFormData({});
                }}
                className="text-gray-400 hover:text-white"
                aria-label="Close form modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form id="content-form" onSubmit={handleFormSubmit}>
              {renderForm()}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedForm("");
                    setFormData({});
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="content-form"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <StatIcon icon={stat.icon} color={stat.color} />
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-white text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
            aria-label="Overview Tab"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "announcements"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
            aria-label="Announcements Tab"
          >
            Announcements
          </button>
          {/* Add other tabs as needed */}
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <span>Upcoming Events</span>
            </h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">
                        {event.event}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-yellow-500 hover:text-yellow-400"
                        aria-label={`Edit event ${event.event}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-500 hover:text-red-400"
                        aria-label={`Delete event ${event.event}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedForm("event");
                setFormData({ id: null, event: "", date: "", time: "" });
              }}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              aria-label="Add Event"
            >
              Add Event
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-3">{/* ... activity items */}</div>
          </div>
        </div>
      )}

      {/* Announcements Tab Content */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <span>Announcements</span>
          </h3>
          {announcements.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">
                No announcements available
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">
                      {announcement.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {announcement.content}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {announcement.date} by {announcement.author}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-red-500 hover:text-red-400"
                      aria-label={`Delete announcement ${announcement.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => {
              setSelectedForm("announcement");
              setFormData({});
            }}
            className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            aria-label="Add Announcement"
          >
            Add Announcement
          </button>
        </div>
      )}

      {/* Students Tab Content */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  aria-label="Search students"
                />
              </div>
            </div>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              aria-label="Add Student"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add Student</span>
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
            <table className="w-full">{/* ... student table */}</table>
          </div>
        </div>
      )}

      {/* Pending Actions Tab Content */}
      {activeTab === "actions" && (
        <div className="space-y-4">
          {pendingActions.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No pending actions</p>
            </div>
          ) : (
            pendingActions.map((action) => (
              <div
                key={action.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                {/* ... pending action items */}
              </div>
            ))
          )}
        </div>
      )}

      {/* Assignments Tab Content */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  aria-label="Search assignments"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {assignment.title}
                    </h3>
                    {assignment.description && (
                      <p className="text-gray-400 text-sm mb-3">
                        {assignment.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm flex-wrap">
                      <span className="flex items-center space-x-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {assignment.dueDate}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-400">
                        <Award className="w-4 h-4" />
                        <span>{assignment.points} points</span>
                      </span>
                    </div>
                    {assignment.status === "submitted" && (
                      <div className="mt-3">
                        <label className="block text-gray-400 text-sm mb-2">
                          Grade
                        </label>
                        <input
                          type="number"
                          value={formData[assignment.id] || ""}
                          onChange={(e) =>
                            handleGradeChange(assignment.id, e.target.value)
                          }
                          className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                          placeholder="Enter grade"
                        />
                        <button
                          onClick={() => handleGradeSubmit(assignment.id)}
                          className="ml-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                        >
                          Submit Grade
                        </button>
                      </div>
                    )}
                    {assignment.status === "graded" && (
                      <div className="mt-3">
                        <p className="text-gray-300 text-sm font-semibold">
                          Grade: {assignment.grade}/{assignment.points}
                        </p>
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      assignment.status === "graded"
                        ? "bg-green-500 text-white"
                        : assignment.status === "submitted"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {assignment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrator;