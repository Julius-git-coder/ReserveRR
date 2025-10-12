

// import React, { useState, useEffect } from "react";
// import {
//   Users,
//   BookOpen,
//   TrendingUp,
//   Bell,
//   Calendar,
//   Edit,
//   Trash2,
//   Settings,
//   X,
//   Dumbbell,
//   FolderOpen,
// } from "lucide-react";
// import useManageStore from "../Store/useManageStore";
// import Projects from "../../Pages/Projects";

// const Administrator = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedForm, setSelectedForm] = useState("");
//   const [formData, setFormData] = useState({});

//   // Use selector pattern for better performance
//   const announcements = useManageStore((state) => state.announcements);
//   const addAnnouncement = useManageStore((state) => state.addAnnouncement);
//   const updateAnnouncement = useManageStore(
//     (state) => state.updateAnnouncement
//   );
//   const deleteAnnouncement = useManageStore(
//     (state) => state.deleteAnnouncement
//   );
//   const events = useManageStore((state) => state.events);
//   const addEvent = useManageStore((state) => state.addEvent);
//   const updateEvent = useManageStore((state) => state.updateEvent);
//   const deleteEvent = useManageStore((state) => state.deleteEvent);
//   const assignments = useManageStore((state) => state.assignments);
//   const addAssignment = useManageStore((state) => state.addAssignment);
//   const updateAssignment = useManageStore((state) => state.updateAssignment);
//   const deleteAssignment = useManageStore((state) => state.deleteAssignment);
//   const exercises = useManageStore((state) => state.exercises);
//   const addExercise = useManageStore((state) => state.addExercise);
//   const updateExercise = useManageStore((state) => state.updateExercise);
//   const deleteExercise = useManageStore((state) => state.deleteExercise);
//   const projects = useManageStore((state) => state.projects);
//   const addProject = useManageStore((state) => state.addProject);
//   const updateProject = useManageStore((state) => state.updateProject);
//   const deleteProject = useManageStore((state) => state.deleteProject);

//   // Debug log
//   useEffect(() => {
//     console.log("Administrator - Announcements:", announcements);
//     console.log("Administrator - Assignments:", assignments);
//     console.log("Administrator - Exercises:", exercises);
//     console.log("Administrator - Projects:", projects);
//   }, [announcements, assignments, exercises, projects]);

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

//   const pendingActions = [
//     ...assignments
//       .filter((assignment) => assignment.status === "submitted")
//       .map((assignment) => ({
//         id: `assignment-${assignment.id}`,
//         type: "Assignment Review",
//         student:
//           recentStudents.find((s) => s.id === assignment.studentId)?.name ||
//           "Unknown",
//         description: assignment.title,
//         priority: "medium",
//       })),
//     ...exercises
//       .filter((exercise) => exercise.status === "submitted")
//       .map((exercise) => ({
//         id: `exercise-${exercise.id}`,
//         type: "Exercise Review",
//         student:
//           recentStudents.find((s) => s.id === exercise.studentId)?.name ||
//           "Unknown",
//         description: exercise.title,
//         priority: "medium",
//       })),
//     ...projects
//       .filter((project) => project.status === "submitted")
//       .map((project) => ({
//         id: `project-${project.id}`,
//         type: "Project Review",
//         student:
//           recentStudents.find((s) => s.id === project.studentId)?.name ||
//           "Unknown",
//         description: project.title,
//         priority: "medium",
//       })),
//   ];

//   const StatIcon = ({ icon: IconComponent, color }) => (
//     <IconComponent
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
//       case "announcement": {
//         if (!formData.title || !formData.content) {
//           alert("Please fill in all required fields (Title and Content).");
//           return;
//         }
//         const now = new Date();
//         const newAnnouncement = {
//           id: newId(announcements),
//           title: formData.title,
//           content: formData.content,
//           date: now.toISOString().split("T")[0],
//           time: now.toTimeString().split(" ")[0].slice(0, 5),
//           priority: formData.priority || "medium",
//           author: formData.author || "Admin Team",
//         };
//         addAnnouncement(newAnnouncement);
//         alert("Announcement added successfully!");
//         break;
//       }
//       case "announcement-edit": {
//         if (!formData.title || !formData.content) {
//           alert("Please fill in all required fields (Title and Content).");
//           return;
//         }
//         const announcement = announcements.find((a) => a.id === formData.id);
//         updateAnnouncement(formData.id, {
//           title: formData.title,
//           content: formData.content,
//           priority: formData.priority || "medium",
//           author: formData.author || "Admin Team",
//           date: announcement.date,
//           time: announcement.time,
//         });
//         alert("Announcement updated successfully!");
//         break;
//       }
//       case "assignment": {
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
//         const now = new Date();
//         const newAssignment = {
//           id: newId(assignments),
//           title: formData.title,
//           description: formData.description || "",
//           dueDate: formData.dueDate,
//           points,
//           studentId: parseInt(formData.studentId),
//           status: "pending",
//           createdDate: now.toISOString().split("T")[0],
//           createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
//         };
//         addAssignment(newAssignment);
//         alert("Assignment added successfully! Student will see it now.");
//         break;
//       }
//       case "assignment-edit": {
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
//         updateAssignment(formData.id, {
//           title: formData.title,
//           description: formData.description || "",
//           dueDate: formData.dueDate,
//           points,
//           studentId: parseInt(formData.studentId),
//         });
//         alert("Assignment updated successfully!");
//         break;
//       }
//       case "exercise": {
//         if (!formData.title || !formData.points || !formData.studentId) {
//           alert("Please fill in all required fields.");
//           return;
//         }
//         const points = parseInt(formData.points);
//         if (isNaN(points) || points <= 0) {
//           alert("Please enter a valid number of points.");
//           return;
//         }
//         const now = new Date();
//         const newExercise = {
//           id: newId(exercises),
//           title: formData.title,
//           description: formData.description || "",
//           points,
//           studentId: parseInt(formData.studentId),
//           status: "pending",
//           createdDate: now.toISOString().split("T")[0],
//           createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
//         };
//         addExercise(newExercise);
//         alert("Exercise added successfully! Student will see it now.");
//         break;
//       }
//       case "exercise-edit": {
//         if (!formData.title || !formData.points || !formData.studentId) {
//           alert("Please fill in all required fields.");
//           return;
//         }
//         const points = parseInt(formData.points);
//         if (isNaN(points) || points <= 0) {
//           alert("Please enter a valid number of points.");
//           return;
//         }
//         updateExercise(formData.id, {
//           title: formData.title,
//           description: formData.description || "",
//           points,
//           studentId: parseInt(formData.studentId),
//         });
//         alert("Exercise updated successfully!");
//         break;
//       }
//       case "project": {
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
//         const now = new Date();
//         const newProject = {
//           id: newId(projects),
//           title: formData.title,
//           description: formData.description || "",
//           dueDate: formData.dueDate,
//           points,
//           studentId: parseInt(formData.studentId),
//           status: "pending",
//           createdDate: now.toISOString().split("T")[0],
//           createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
//         };
//         addProject(newProject);
//         alert("Project added successfully! Student will see it now.");
//         break;
//       }
//       case "project-edit": {
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
//         updateProject(formData.id, {
//           title: formData.title,
//           description: formData.description || "",
//           dueDate: formData.dueDate,
//           points,
//           studentId: parseInt(formData.studentId),
//         });
//         alert("Project updated successfully!");
//         break;
//       }
//       case "event": {
//         if (!formData.event || !formData.date || !formData.time) {
//           alert("Please fill in all required fields (Event, Date, and Time).");
//           return;
//         }
//         if (formData.id) {
//           updateEvent(formData.id, {
//             event: formData.event,
//             date: formData.date,
//             time: formData.time,
//           });
//           alert("Event updated successfully!");
//         } else {
//           addEvent({
//             id: newId(events),
//             event: formData.event,
//             date: formData.date,
//             time: formData.time,
//           });
//           alert("Event added successfully!");
//         }
//         break;
//       }
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

//   const handleEditAnnouncement = (announcement) => {
//     setFormData({
//       id: announcement.id,
//       title: announcement.title,
//       content: announcement.content,
//       priority: announcement.priority,
//       author: announcement.author,
//     });
//     setSelectedForm("announcement-edit");
//   };

//   const handleGradeChange = (id, value) => {
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleMarkSubmitted = (id, type) => {
//     if (type === "assignment") {
//       updateAssignment(id, { status: "submitted" });
//       alert("Assignment marked as submitted!");
//     } else if (type === "exercise") {
//       updateExercise(id, { status: "submitted" });
//       alert("Exercise marked as submitted!");
//     } else if (type === "project") {
//       updateProject(id, { status: "submitted" });
//       alert("Project marked as submitted!");
//     }
//   };

//   const handleEditAssignment = (assignment) => {
//     setFormData({
//       id: assignment.id,
//       title: assignment.title,
//       description: assignment.description,
//       dueDate: assignment.dueDate,
//       points: assignment.points,
//       studentId: assignment.studentId,
//     });
//     setSelectedForm("assignment-edit");
//   };

//   const handleEditExercise = (exercise) => {
//     setFormData({
//       id: exercise.id,
//       title: exercise.title,
//       description: exercise.description,
//       points: exercise.points,
//       studentId: exercise.studentId,
//     });
//     setSelectedForm("exercise-edit");
//   };

//   const handleEditProject = (project) => {
//     setFormData({
//       id: project.id,
//       title: project.title,
//       description: project.description,
//       dueDate: project.dueDate,
//       points: project.points,
//       studentId: project.studentId,
//     });
//     setSelectedForm("project-edit");
//   };

//   const handleDeleteAssignment = (assignmentId) => {
//     if (window.confirm("Are you sure you want to delete this assignment?")) {
//       deleteAssignment(assignmentId);
//       alert("Assignment deleted successfully!");
//     }
//   };

//   const handleDeleteExercise = (exerciseId) => {
//     if (window.confirm("Are you sure you want to delete this exercise?")) {
//       deleteExercise(exerciseId);
//       alert("Exercise deleted successfully!");
//     }
//   };

//   const handleDeleteProject = (projectId) => {
//     if (window.confirm("Are you sure you want to delete this project?")) {
//       deleteProject(projectId);
//       alert("Project deleted successfully!");
//     }
//   };

//   const handleGradeSubmit = (id, type) => {
//     const grade = parseFloat(formData[id]);
//     let item;
//     if (type === "assignment") {
//       item = assignments.find((a) => a.id === id);
//       updateAssignment(id, { status: "graded", grade });
//     } else if (type === "exercise") {
//       item = exercises.find((e) => e.id === id);
//       updateExercise(id, { status: "graded", grade });
//     } else if (type === "project") {
//       item = projects.find((p) => p.id === id);
//       updateProject(id, { status: "graded", grade });
//     }

//     if (isNaN(grade) || grade < 0 || grade > item.points) {
//       alert("Please enter a valid grade between 0 and the maximum points.");
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [id]: "" }));
//     alert("Grade submitted successfully!");
//   };

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

//   const filteredExercises =
//     activeTab === "exercises"
//       ? exercises.filter(
//           (e) =>
//             e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             recentStudents
//               .find((s) => s.id === e.studentId)
//               ?.name.toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         )
//       : exercises;

//   const filteredProjects =
//     activeTab === "projects"
//       ? projects.filter(
//           (p) =>
//             p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             recentStudents
//               .find((s) => s.id === p.studentId)
//               ?.name.toLowerCase()
//               .includes(searchTerm.toLowerCase())
//         )
//       : projects;

//   const renderForm = () => {
//     switch (selectedForm) {
//       case "announcement":
//       case "announcement-edit":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Content *
//               </label>
//               <textarea
//                 value={formData.content || ""}
//                 onChange={(e) => handleFormChange("content", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 rows="4"
//                 required
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
//       case "assignment-edit":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
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
//                 Due Date *
//               </label>
//               <input
//                 type="date"
//                 value={formData.dueDate || ""}
//                 onChange={(e) => handleFormChange("dueDate", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Points *
//               </label>
//               <input
//                 type="number"
//                 value={formData.points || ""}
//                 onChange={(e) => handleFormChange("points", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Student ID * (Enter 1 for Julius Dagana)
//               </label>
//               <input
//                 type="number"
//                 value={formData.studentId || ""}
//                 onChange={(e) => handleFormChange("studentId", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 placeholder="1"
//                 required
//               />
//               <p className="text-gray-500 text-xs mt-1">
//                 Current student: Julius Dagana (ID: 1)
//               </p>
//             </div>
//           </div>
//         );
//       case "exercise":
//       case "exercise-edit":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
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
//                 Points *
//               </label>
//               <input
//                 type="number"
//                 value={formData.points || ""}
//                 onChange={(e) => handleFormChange("points", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Student ID * (Enter 1 for Julius Dagana)
//               </label>
//               <input
//                 type="number"
//                 value={formData.studentId || ""}
//                 onChange={(e) => handleFormChange("studentId", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 placeholder="1"
//                 required
//               />
//               <p className="text-gray-500 text-xs mt-1">
//                 Current student: Julius Dagana (ID: 1)
//               </p>
//             </div>
//           </div>
//         );
//       case "project":
//       case "project-edit":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title || ""}
//                 onChange={(e) => handleFormChange("title", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
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
//                 Due Date *
//               </label>
//               <input
//                 type="date"
//                 value={formData.dueDate || ""}
//                 onChange={(e) => handleFormChange("dueDate", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Points *
//               </label>
//               <input
//                 type="number"
//                 value={formData.points || ""}
//                 onChange={(e) => handleFormChange("points", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Student ID * (Enter 1 for Julius Dagana)
//               </label>
//               <input
//                 type="number"
//                 value={formData.studentId || ""}
//                 onChange={(e) => handleFormChange("studentId", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 placeholder="1"
//                 required
//               />
//               <p className="text-gray-500 text-xs mt-1">
//                 Current student: Julius Dagana (ID: 1)
//               </p>
//             </div>
//           </div>
//         );
//       case "event":
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">
//                 Event *
//               </label>
//               <input
//                 type="text"
//                 value={formData.event || ""}
//                 onChange={(e) => handleFormChange("event", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Date *</label>
//               <input
//                 type="date"
//                 value={formData.date || ""}
//                 onChange={(e) => handleFormChange("date", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-400 text-sm mb-2">Time *</label>
//               <input
//                 type="time"
//                 value={formData.time || ""}
//                 onChange={(e) => handleFormChange("time", e.target.value)}
//                 className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                 required
//               />
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
//             Manage students, assignments, exercises, and system settings
//           </p>
//         </div>
//         <div className="flex items-center space-x-3 flex-wrap gap-2">
//           <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
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
//           >
//             <option value="">Select Content Type</option>
//             <option value="announcement">New Announcement</option>
//             <option value="assignment">New Assignment</option>
//             <option value="exercise">New Exercise</option>
//             <option value="project">New Project</option>
//             <option value="event">New Event</option>
//           </select>
//           <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
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
//                 {selectedForm === "announcement" && "New Announcement"}
//                 {selectedForm === "announcement-edit" && "Edit Announcement"}
//                 {selectedForm === "assignment" && "New Assignment"}
//                 {selectedForm === "assignment-edit" && "Edit Assignment"}
//                 {selectedForm === "exercise" && "New Exercise"}
//                 {selectedForm === "exercise-edit" && "Edit Exercise"}
//                 {selectedForm === "project" && "New Project"}
//                 {selectedForm === "project-edit" && "Edit Project"}
//                 {selectedForm === "event" &&
//                   (formData.id ? "Edit Event" : "New Event")}
//               </h2>
//               <button
//                 onClick={() => {
//                   setSelectedForm("");
//                   setFormData({});
//                 }}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <form onSubmit={handleFormSubmit}>
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
//           >
//             Overview
//           </button>
//           <button
//             onClick={() => setActiveTab("announcements")}
//             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
//               activeTab === "announcements"
//                 ? "bg-yellow-500 text-gray-900"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Announcements
//           </button>
//           <button
//             onClick={() => setActiveTab("assignments")}
//             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
//               activeTab === "assignments"
//                 ? "bg-yellow-500 text-gray-900"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Assignments
//           </button>
//           <button
//             onClick={() => setActiveTab("exercises")}
//             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
//               activeTab === "exercises"
//                 ? "bg-yellow-500 text-gray-900"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Exercises
//           </button>
//           <button
//             onClick={() => setActiveTab("projects")}
//             className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
//               activeTab === "projects"
//                 ? "bg-yellow-500 text-gray-900"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             Projects
//           </button>
//         </div>
//       </div>

//       {/* Overview Tab */}
//       {activeTab === "overview" && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
//               <Calendar className="w-5 h-5 text-yellow-500" />
//               <span>Upcoming Events</span>
//             </h3>
//             <div className="space-y-3">
//               {events.length === 0 ? (
//                 <p className="text-gray-400 text-sm text-center py-4">
//                   No events scheduled
//                 </p>
//               ) : (
//                 events.map((event) => (
//                   <div
//                     key={event.id}
//                     className="bg-gray-900 rounded-lg p-4 border border-gray-700"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h4 className="text-white font-semibold">
//                           {event.event}
//                         </h4>
//                         <p className="text-gray-400 text-sm">
//                           {event.date} at {event.time}
//                         </p>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => handleEditEvent(event)}
//                           className="text-yellow-500 hover:text-yellow-400"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => deleteEvent(event.id)}
//                           className="text-red-500 hover:text-red-400"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedForm("event");
//                 setFormData({});
//               }}
//               className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
//             >
//               Add Event
//             </button>
//           </div>
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
//               <Bell className="w-5 h-5 text-yellow-500" />
//               <span>Pending Actions</span>
//             </h3>
//             {pendingActions.length === 0 ? (
//               <p className="text-gray-400 text-sm text-center py-4">
//                 No pending actions
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {pendingActions.map((action) => (
//                   <div
//                     key={action.id}
//                     className="bg-gray-900 rounded-lg p-4 border border-gray-700"
//                   >
//                     <p className="text-white font-semibold">{action.type}</p>
//                     <p className="text-gray-400 text-sm">
//                       {action.student} - {action.description}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Announcements Tab */}
//       {activeTab === "announcements" && (
//         <div className="space-y-4">
//           <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
//             <Bell className="w-5 h-5 text-yellow-500" />
//             <span>Announcements</span>
//           </h3>
//           {announcements.length === 0 ? (
//             <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
//               <p className="text-gray-400 text-lg">
//                 No announcements available
//               </p>
//             </div>
//           ) : (
//             announcements.map((announcement) => (
//               <div
//                 key={announcement.id}
//                 className="bg-gray-900 rounded-lg p-4 border border-gray-700"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <h4 className="text-white font-semibold">
//                       {announcement.title}
//                     </h4>
//                     <p className="text-gray-400 text-sm">
//                       {announcement.content}
//                     </p>
//                     <p className="text-gray-500 text-xs mt-2">
//                       {announcement.date} at {announcement.time} by{" "}
//                       {announcement.author}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => handleEditAnnouncement(announcement)}
//                       className="text-yellow-500 hover:text-yellow-400"
//                       title="Edit Announcement"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => deleteAnnouncement(announcement.id)}
//                       className="text-red-500 hover:text-red-400"
//                       title="Delete Announcement"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//           <button
//             onClick={() => {
//               setSelectedForm("announcement");
//               setFormData({});
//             }}
//             className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
//           >
//             Add Announcement
//           </button>
//         </div>
//       )}

//       {/* Assignments Tab */}
//       {activeTab === "assignments" && (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-white text-lg font-semibold">
//               All Assignments
//             </h3>
//             <button
//               onClick={() => {
//                 setSelectedForm("assignment");
//                 setFormData({});
//               }}
//               className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//             >
//               New Assignment
//             </button>
//           </div>
//           <input
//             type="text"
//             placeholder="Search assignments..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//           />
//           {filteredAssignments.length === 0 ? (
//             <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
//               <p className="text-gray-400 text-lg">No assignments yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredAssignments.map((assignment) => (
//                 <div
//                   key={assignment.id}
//                   className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <h4 className="text-white font-semibold text-lg mb-2">
//                         {assignment.title}
//                       </h4>
//                       {assignment.description && (
//                         <p className="text-gray-400 text-sm mb-3">
//                           {assignment.description}
//                         </p>
//                       )}
//                       <div className="flex items-center space-x-4 text-sm">
//                         <span className="text-gray-400">
//                           Due: {assignment.dueDate}
//                         </span>
//                         <span className="text-gray-400">
//                           {assignment.points} points
//                         </span>
//                         <span className="text-gray-400">
//                           Student:{" "}
//                           {
//                             recentStudents.find(
//                               (s) => s.id === assignment.studentId
//                             )?.name
//                           }
//                         </span>
//                       </div>
//                       {assignment.createdDate && assignment.createdTime && (
//                         <p className="text-gray-500 text-xs mt-2">
//                           Created: {assignment.createdDate} at{" "}
//                           {assignment.createdTime}
//                         </p>
//                       )}
//                       {assignment.status === "pending" && (
//                         <div className="mt-4 flex items-center space-x-3">
//                           <button
//                             onClick={() =>
//                               handleMarkSubmitted(assignment.id, "assignment")
//                             }
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
//                           >
//                             Mark as Submitted
//                           </button>
//                         </div>
//                       )}
//                       {assignment.status === "submitted" && (
//                         <div className="mt-4 flex items-center space-x-3">
//                           <input
//                             type="number"
//                             value={formData[assignment.id] || ""}
//                             onChange={(e) =>
//                               handleGradeChange(assignment.id, e.target.value)
//                             }
//                             className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                             placeholder="Grade"
//                           />
//                           <button
//                             onClick={() =>
//                               handleGradeSubmit(assignment.id, "assignment")
//                             }
//                             className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//                           >
//                             Submit Grade
//                           </button>
//                         </div>
//                       )}
//                       {assignment.status === "graded" && (
//                         <div className="mt-3">
//                           <p className="text-green-400 text-sm font-semibold">
//                             Graded: {assignment.grade}/{assignment.points}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           assignment.status === "graded"
//                             ? "bg-green-500 text-white"
//                             : assignment.status === "submitted"
//                             ? "bg-blue-500 text-white"
//                             : "bg-yellow-500 text-gray-900"
//                         }`}
//                       >
//                         {assignment.status.toUpperCase()}
//                       </span>
//                       <button
//                         onClick={() => handleEditAssignment(assignment)}
//                         className="text-yellow-500 hover:text-yellow-400"
//                         title="Edit Assignment"
//                       >
//                         <Edit className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteAssignment(assignment.id)}
//                         className="text-red-500 hover:text-red-400"
//                         title="Delete Assignment"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Exercises Tab */}
//       {activeTab === "exercises" && (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
//               <Dumbbell className="w-5 h-5 text-yellow-500" />
//               <span>All Exercises</span>
//             </h3>
//             <button
//               onClick={() => {
//                 setSelectedForm("exercise");
//                 setFormData({});
//               }}
//               className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//             >
//               New Exercise
//             </button>
//           </div>
//           <input
//             type="text"
//             placeholder="Search exercises..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//           />
//           {filteredExercises.length === 0 ? (
//             <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
//               <p className="text-gray-400 text-lg">No exercises yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredExercises.map((exercise) => (
//                 <div
//                   key={exercise.id}
//                   className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <h4 className="text-white font-semibold text-lg mb-2">
//                         {exercise.title}
//                       </h4>
//                       {exercise.description && (
//                         <p className="text-gray-400 text-sm mb-3">
//                           {exercise.description}
//                         </p>
//                       )}
//                       <div className="flex items-center space-x-4 text-sm">
//                         <span className="text-gray-400">
//                           {exercise.points} points
//                         </span>
//                         <span className="text-gray-400">
//                           Student:{" "}
//                           {
//                             recentStudents.find(
//                               (s) => s.id === exercise.studentId
//                             )?.name
//                           }
//                         </span>
//                       </div>
//                       {exercise.createdDate && exercise.createdTime && (
//                         <p className="text-gray-500 text-xs mt-2">
//                           Created: {exercise.createdDate} at{" "}
//                           {exercise.createdTime}
//                         </p>
//                       )}
//                       {exercise.status === "pending" && (
//                         <div className="mt-4 flex items-center space-x-3">
//                           <button
//                             onClick={() =>
//                               handleMarkSubmitted(exercise.id, "exercise")
//                             }
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
//                           >
//                             Mark as Submitted
//                           </button>
//                         </div>
//                       )}
//                       {exercise.status === "submitted" && (
//                         <div className="mt-4 flex items-center space-x-3">
//                           <input
//                             type="number"
//                             value={formData[exercise.id] || ""}
//                             onChange={(e) =>
//                               handleGradeChange(exercise.id, e.target.value)
//                             }
//                             className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                             placeholder="Grade"
//                           />
//                           <button
//                             onClick={() =>
//                               handleGradeSubmit(exercise.id, "exercise")
//                             }
//                             className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//                           >
//                             Submit Grade
//                           </button>
//                         </div>
//                       )}
//                       {exercise.status === "graded" && (
//                         <div className="mt-3">
//                           <p className="text-green-400 text-sm font-semibold">
//                             Graded: {exercise.grade}/{exercise.points}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           exercise.status === "graded"
//                             ? "bg-green-500 text-white"
//                             : exercise.status === "submitted"
//                             ? "bg-blue-500 text-white"
//                             : "bg-yellow-500 text-gray-900"
//                         }`}
//                       >
//                         {exercise.status.toUpperCase()}
//                       </span>
//                       <button
//                         onClick={() => handleEditExercise(exercise)}
//                         className="text-yellow-500 hover:text-yellow-400"
//                         title="Edit Exercise"
//                       >
//                         <Edit className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteExercise(exercise.id)}
//                         className="text-red-500 hover:text-red-400"
//                         title="Delete Exercise"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Projects Tab */}
//       {activeTab === "projects" && (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
//               <FolderOpen className="w-5 h-5 text-yellow-500" />
//               <span>All Projects</span>
//             </h3>
//             <button
//               onClick={() => {
//                 setSelectedForm("project");
//                 setFormData({});
//               }}
//               className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//             >
//               New Project
//             </button>
//           </div>
//           <input
//             type="text"
//             placeholder="Search projects..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//           />
//           {filteredProjects.length === 0 ? (
//             <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
//               <p className="text-gray-400 text-lg">No projects yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredProjects.map((project) => (
//                 <div
//                   key={project.id}
//                   className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex-1">
//                       <h4 className="text-white font-semibold text-lg mb-2">
//                         {project.title}
//                       </h4>
//                       {project.description && (
//                         <p className="text-gray-400 text-sm mb-3">
//                           {project.description}
//                         </p>
//                       )}
//                       <div className="flex items-center space-x-4 text-sm">
//                         <span className="text-gray-400">
//                           Due: {project.dueDate}
//                         </span>
//                         <span className="text-gray-400">
//                           {project.points} points
//                         </span>
//                         <span className="text-gray-400">
//                           Student:{" "}
//                           {
//                             recentStudents.find(
//                               (s) => s.id === project.studentId
//                             )?.name
//                           }
//                         </span>
//                       </div>
//                       {project.createdDate && project.createdTime && (
//                         <p className="text-gray-500 text-xs mt-2">
//                           Created: {project.createdDate} at{" "}
//                           {project.createdTime}
//                         </p>
//                       )}
//                       {project.status === "pending" && (
//                         <div className="mt-4 flex items-center space-x-3">
//                           <button
//                             onClick={() =>
//                               handleMarkSubmitted(project.id, "project")
//                             }
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
//                           >
//                             Mark as Submitted
//                           </button>
//                         </div>
//                       )}
//                       {project.status === "submitted" && (
//                         <div className="mt-4 flex items-center space-x-3">
//                           <input
//                             type="number"
//                             value={formData[project.id] || ""}
//                             onChange={(e) =>
//                               handleGradeChange(project.id, e.target.value)
//                             }
//                             className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
//                             placeholder="Grade"
//                           />
//                           <button
//                             onClick={() =>
//                               handleGradeSubmit(project.id, "project")
//                             }
//                             className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
//                           >
//                             Submit Grade
//                           </button>
//                         </div>
//                       )}
//                       {project.status === "graded" && (
//                         <div className="mt-3">
//                           <p className="text-green-400 text-sm font-semibold">
//                             Graded: {project.grade}/{project.points}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           project.status === "graded"
//                             ? "bg-green-500 text-white"
//                             : project.status === "submitted"
//                             ? "bg-blue-500 text-white"
//                             : "bg-yellow-500 text-gray-900"
//                         }`}
//                       >
//                         {project.status.toUpperCase()}
//                       </span>
//                       <button
//                         onClick={() => handleEditProject(project)}
//                         className="text-yellow-500 hover:text-yellow-400"
//                         title="Edit Project"
//                       >
//                         <Edit className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteProject(project.id)}
//                         className="text-red-500 hover:text-red-400"
//                         title="Delete Project"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
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
  Edit,
  Trash2,
  Settings,
  X,
  Dumbbell,
  FolderOpen,
  UserCheck,
} from "lucide-react";
import useManageStore from "../Store/useManageStore";
import Projects from "../../Pages/Projects";

const Administrator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});

  // Use selector pattern for better performance
  const announcements = useManageStore((state) => state.announcements);
  const addAnnouncement = useManageStore((state) => state.addAnnouncement);
  const updateAnnouncement = useManageStore(
    (state) => state.updateAnnouncement
  );
  const deleteAnnouncement = useManageStore(
    (state) => state.deleteAnnouncement
  );
  const events = useManageStore((state) => state.events);
  const addEvent = useManageStore((state) => state.addEvent);
  const updateEvent = useManageStore((state) => state.updateEvent);
  const deleteEvent = useManageStore((state) => state.deleteEvent);
  const assignments = useManageStore((state) => state.assignments);
  const addAssignment = useManageStore((state) => state.addAssignment);
  const updateAssignment = useManageStore((state) => state.updateAssignment);
  const deleteAssignment = useManageStore((state) => state.deleteAssignment);
  const exercises = useManageStore((state) => state.exercises);
  const addExercise = useManageStore((state) => state.addExercise);
  const updateExercise = useManageStore((state) => state.updateExercise);
  const deleteExercise = useManageStore((state) => state.deleteExercise);
  const projects = useManageStore((state) => state.projects);
  const addProject = useManageStore((state) => state.addProject);
  const updateProject = useManageStore((state) => state.updateProject);
  const deleteProject = useManageStore((state) => state.deleteProject);
  const attendance = useManageStore((state) => state.attendance);
  const addAttendance = useManageStore((state) => state.addAttendance);
  const updateAttendance = useManageStore((state) => state.updateAttendance);
  const deleteAttendance = useManageStore((state) => state.deleteAttendance);

  // Debug log
  useEffect(() => {
    console.log("Administrator - Announcements:", announcements);
    console.log("Administrator - Assignments:", assignments);
    console.log("Administrator - Exercises:", exercises);
    console.log("Administrator - Projects:", projects);
    console.log("Administrator - Attendance:", attendance);
  }, [announcements, assignments, exercises, projects, attendance]);

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

  const pendingActions = [
    ...assignments
      .filter((assignment) => assignment.status === "submitted")
      .map((assignment) => ({
        id: `assignment-${assignment.id}`,
        type: "Assignment Review",
        student:
          recentStudents.find((s) => s.id === assignment.studentId)?.name ||
          "Unknown",
        description: assignment.title,
        priority: "medium",
      })),
    ...exercises
      .filter((exercise) => exercise.status === "submitted")
      .map((exercise) => ({
        id: `exercise-${exercise.id}`,
        type: "Exercise Review",
        student:
          recentStudents.find((s) => s.id === exercise.studentId)?.name ||
          "Unknown",
        description: exercise.title,
        priority: "medium",
      })),
    ...projects
      .filter((project) => project.status === "submitted")
      .map((project) => ({
        id: `project-${project.id}`,
        type: "Project Review",
        student:
          recentStudents.find((s) => s.id === project.studentId)?.name ||
          "Unknown",
        description: project.title,
        priority: "medium",
      })),
  ];

  const StatIcon = ({ icon: IconComponent, color }) => (
    <IconComponent
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
      case "announcement": {
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const now = new Date();
        const newAnnouncement = {
          id: newId(announcements),
          title: formData.title,
          content: formData.content,
          date: now.toISOString().split("T")[0],
          time: now.toTimeString().split(" ")[0].slice(0, 5),
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
        };
        addAnnouncement(newAnnouncement);
        alert("Announcement added successfully!");
        break;
      }
      case "announcement-edit": {
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const announcement = announcements.find((a) => a.id === formData.id);
        updateAnnouncement(formData.id, {
          title: formData.title,
          content: formData.content,
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
          date: announcement.date,
          time: announcement.time,
        });
        alert("Announcement updated successfully!");
        break;
      }
      case "assignment": {
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
        const now = new Date();
        const newAssignment = {
          id: newId(assignments),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addAssignment(newAssignment);
        alert("Assignment added successfully! Student will see it now.");
        break;
      }
      case "assignment-edit": {
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
        updateAssignment(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Assignment updated successfully!");
        break;
      }
      case "exercise": {
        if (!formData.title || !formData.points || !formData.studentId) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newExercise = {
          id: newId(exercises),
          title: formData.title,
          description: formData.description || "",
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addExercise(newExercise);
        alert("Exercise added successfully! Student will see it now.");
        break;
      }
      case "exercise-edit": {
        if (!formData.title || !formData.points || !formData.studentId) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateExercise(formData.id, {
          title: formData.title,
          description: formData.description || "",
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Exercise updated successfully!");
        break;
      }
      case "project": {
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
        const now = new Date();
        const newProject = {
          id: newId(projects),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addProject(newProject);
        alert("Project added successfully! Student will see it now.");
        break;
      }
      case "project-edit": {
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
        updateProject(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Project updated successfully!");
        break;
      }
      case "event": {
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
          alert("Event updated successfully!");
        } else {
          addEvent({
            id: newId(events),
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
          alert("Event added successfully!");
        }
        break;
      }
      case "attendance": {
        if (
          !formData.date ||
          !formData.status ||
          !formData.topic ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const newAttendance = {
          id: newId(attendance),
          date: formData.date,
          status: formData.status,
          topic: formData.topic,
          studentId: parseInt(formData.studentId),
        };
        addAttendance(newAttendance);
        alert("Attendance record added successfully! Student will see it now.");
        break;
      }
      case "attendance-edit": {
        if (
          !formData.date ||
          !formData.status ||
          !formData.topic ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        updateAttendance(formData.id, {
          date: formData.date,
          status: formData.status,
          topic: formData.topic,
          studentId: parseInt(formData.studentId),
        });
        alert("Attendance record updated successfully!");
        break;
      }
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

  const handleEditAnnouncement = (announcement) => {
    setFormData({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      author: announcement.author,
    });
    setSelectedForm("announcement-edit");
  };

  const handleGradeChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleMarkSubmitted = (id, type) => {
    if (type === "assignment") {
      updateAssignment(id, { status: "submitted" });
      alert("Assignment marked as submitted!");
    } else if (type === "exercise") {
      updateExercise(id, { status: "submitted" });
      alert("Exercise marked as submitted!");
    } else if (type === "project") {
      updateProject(id, { status: "submitted" });
      alert("Project marked as submitted!");
    }
  };

  const handleEditAssignment = (assignment) => {
    setFormData({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points,
      studentId: assignment.studentId,
    });
    setSelectedForm("assignment-edit");
  };

  const handleEditExercise = (exercise) => {
    setFormData({
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      points: exercise.points,
      studentId: exercise.studentId,
    });
    setSelectedForm("exercise-edit");
  };

  const handleEditProject = (project) => {
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      dueDate: project.dueDate,
      points: project.points,
      studentId: project.studentId,
    });
    setSelectedForm("project-edit");
  };

  const handleEditAttendance = (attendance) => {
    setFormData({
      id: attendance.id,
      date: attendance.date,
      status: attendance.status,
      topic: attendance.topic,
      studentId: attendance.studentId,
    });
    setSelectedForm("attendance-edit");
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(assignmentId);
      alert("Assignment deleted successfully!");
    }
  };

  const handleDeleteExercise = (exerciseId) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(exerciseId);
      alert("Exercise deleted successfully!");
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
      alert("Project deleted successfully!");
    }
  };

  const handleDeleteAttendance = (attendanceId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      deleteAttendance(attendanceId);
      alert("Attendance record deleted successfully!");
    }
  };

  const handleGradeSubmit = (id, type) => {
    const grade = parseFloat(formData[id]);
    let item;
    if (type === "assignment") {
      item = assignments.find((a) => a.id === id);
      updateAssignment(id, { status: "graded", grade });
    } else if (type === "exercise") {
      item = exercises.find((e) => e.id === id);
      updateExercise(id, { status: "graded", grade });
    } else if (type === "project") {
      item = projects.find((p) => p.id === id);
      updateProject(id, { status: "graded", grade });
    }

    if (isNaN(grade) || grade < 0 || grade > item.points) {
      alert("Please enter a valid grade between 0 and the maximum points.");
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: "" }));
    alert("Grade submitted successfully!");
  };

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

  const filteredExercises =
    activeTab === "exercises"
      ? exercises.filter(
          (e) =>
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recentStudents
              .find((s) => s.id === e.studentId)
              ?.name.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : exercises;

  const filteredProjects =
    activeTab === "projects"
      ? projects.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recentStudents
              .find((s) => s.id === p.studentId)
              ?.name.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : projects;

  const filteredAttendance =
    activeTab === "attendance"
      ? attendance.filter(
          (a) =>
            a.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recentStudents
              .find((s) => s.id === a.studentId)
              ?.name.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : attendance;

  const renderForm = () => {
    switch (selectedForm) {
      case "announcement":
      case "announcement-edit":
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
      case "assignment-edit":
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
            </div>
          </div>
        );
      case "exercise":
      case "exercise-edit":
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
            </div>
          </div>
        );
      case "project":
      case "project-edit":
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
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
      case "attendance":
      case "attendance-edit":
        return (
          <div className="space-y-4">
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
              <label className="block text-gray-400 text-sm mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic || ""}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Status *
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
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
            Manage students, assignments, exercises, and system settings
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
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
          >
            <option value="">Select Content Type</option>
            <option value="announcement">New Announcement</option>
            <option value="assignment">New Assignment</option>
            <option value="exercise">New Exercise</option>
            <option value="project">New Project</option>
            <option value="event">New Event</option>
            <option value="attendance">New Attendance</option>
          </select>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
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
                {selectedForm === "announcement" && "New Announcement"}
                {selectedForm === "announcement-edit" && "Edit Announcement"}
                {selectedForm === "assignment" && "New Assignment"}
                {selectedForm === "assignment-edit" && "Edit Assignment"}
                {selectedForm === "exercise" && "New Exercise"}
                {selectedForm === "exercise-edit" && "Edit Exercise"}
                {selectedForm === "project" && "New Project"}
                {selectedForm === "project-edit" && "Edit Project"}
                {selectedForm === "event" &&
                  (formData.id ? "Edit Event" : "New Event")}
                {selectedForm === "attendance" && "New Attendance"}
                {selectedForm === "attendance-edit" && "Edit Attendance"}
              </h2>
              <button
                onClick={() => {
                  setSelectedForm("");
                  setFormData({});
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
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
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "assignments"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab("exercises")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "exercises"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "attendance"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Attendance
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <span>Upcoming Events</span>
            </h3>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No events scheduled
                </p>
              ) : (
                events.map((event) => (
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
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => {
                setSelectedForm("event");
                setFormData({});
              }}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Add Event
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              <span>Pending Actions</span>
            </h3>
            {pendingActions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No pending actions
              </p>
            ) : (
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <div
                    key={action.id}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                  >
                    <p className="text-white font-semibold">{action.type}</p>
                    <p className="text-gray-400 text-sm">
                      {action.student} - {action.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Announcements Tab */}
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
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">
                      {announcement.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {announcement.content}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {announcement.date} at {announcement.time} by{" "}
                      {announcement.author}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="text-yellow-500 hover:text-yellow-400"
                      title="Edit Announcement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-red-500 hover:text-red-400"
                      title="Delete Announcement"
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
          >
            Add Announcement
          </button>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold">
              All Assignments
            </h3>
            <button
              onClick={() => {
                setSelectedForm("assignment");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Assignment
            </button>
          </div>
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredAssignments.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No assignments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {assignment.title}
                      </h4>
                      {assignment.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {assignment.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Due: {assignment.dueDate}
                        </span>
                        <span className="text-gray-400">
                          {assignment.points} points
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === assignment.studentId
                            )?.name
                          }
                        </span>
                      </div>
                      {assignment.createdDate && assignment.createdTime && (
                        <p className="text-gray-500 text-xs mt-2">
                          Created: {assignment.createdDate} at{" "}
                          {assignment.createdTime}
                        </p>
                      )}
                      {assignment.status === "pending" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleMarkSubmitted(assignment.id, "assignment")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Mark as Submitted
                          </button>
                        </div>
                      )}
                      {assignment.status === "submitted" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="number"
                            value={formData[assignment.id] || ""}
                            onChange={(e) =>
                              handleGradeChange(assignment.id, e.target.value)
                            }
                            className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                            placeholder="Grade"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(assignment.id, "assignment")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                          >
                            Submit Grade
                          </button>
                        </div>
                      )}
                      {assignment.status === "graded" && (
                        <div className="mt-3">
                          <p className="text-green-400 text-sm font-semibold">
                            Graded: {assignment.grade}/{assignment.points}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
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
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Assignment"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === "exercises" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-yellow-500" />
              <span>All Exercises</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("exercise");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Exercise
            </button>
          </div>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredExercises.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No exercises yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {exercise.title}
                      </h4>
                      {exercise.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {exercise.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          {exercise.points} points
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === exercise.studentId
                            )?.name
                          }
                        </span>
                      </div>
                      {exercise.createdDate && exercise.createdTime && (
                        <p className="text-gray-500 text-xs mt-2">
                          Created: {exercise.createdDate} at{" "}
                          {exercise.createdTime}
                        </p>
                      )}
                      {exercise.status === "pending" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleMarkSubmitted(exercise.id, "exercise")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Mark as Submitted
                          </button>
                        </div>
                      )}
                      {exercise.status === "submitted" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="number"
                            value={formData[exercise.id] || ""}
                            onChange={(e) =>
                              handleGradeChange(exercise.id, e.target.value)
                            }
                            className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                            placeholder="Grade"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(exercise.id, "exercise")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                          >
                            Submit Grade
                          </button>
                        </div>
                      )}
                      {exercise.status === "graded" && (
                        <div className="mt-3">
                          <p className="text-green-400 text-sm font-semibold">
                            Graded: {exercise.grade}/{exercise.points}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          exercise.status === "graded"
                            ? "bg-green-500 text-white"
                            : exercise.status === "submitted"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-500 text-gray-900"
                        }`}
                      >
                        {exercise.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Exercise"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Exercise"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-yellow-500" />
              <span>All Projects</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("project");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Project
            </button>
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredProjects.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Due: {project.dueDate}
                        </span>
                        <span className="text-gray-400">
                          {project.points} points
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === project.studentId
                            )?.name
                          }
                        </span>
                      </div>
                      {project.createdDate && project.createdTime && (
                        <p className="text-gray-500 text-xs mt-2">
                          Created: {project.createdDate} at{" "}
                          {project.createdTime}
                        </p>
                      )}
                      {project.status === "pending" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleMarkSubmitted(project.id, "project")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Mark as Submitted
                          </button>
                        </div>
                      )}
                      {project.status === "submitted" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="number"
                            value={formData[project.id] || ""}
                            onChange={(e) =>
                              handleGradeChange(project.id, e.target.value)
                            }
                            className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                            placeholder="Grade"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(project.id, "project")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                          >
                            Submit Grade
                          </button>
                        </div>
                      )}
                      {project.status === "graded" && (
                        <div className="mt-3">
                          <p className="text-green-400 text-sm font-semibold">
                            Graded: {project.grade}/{project.points}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === "graded"
                            ? "bg-green-500 text-white"
                            : project.status === "submitted"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-500 text-gray-900"
                        }`}
                      >
                        {project.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Project"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-yellow-500" />
              <span>All Attendance Records</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("attendance");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Attendance
            </button>
          </div>
          <input
            type="text"
            placeholder="Search attendance records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredAttendance.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No attendance records yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {record.topic}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Date: {record.date}
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === record.studentId
                            )?.name
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "present"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditAttendance(record)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Attendance"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAttendance(record.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Attendance"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Administrator;