Roadmap
1.React/zustand 
2.Tailwindcss: styling
3.Firebase:authentication
4.MongoDB:data storage
5.Express.js : writing Api's  
6.Cloudinary : for image storage
7.User profiles (students, teachers, parents).

Performance records (grades, test results, progress over time).

Activities (attendance, assignments, participation, extracurriculars).

Notifications/updates (new assignments, events, deadlines).

Analytics (charts, progress reports).

Scalability (if many schools/students join).
Classroom Management System
Overview
This project is a Classroom Management System designed to allow an admin to send exercises, projects, assignments, and announcements to students. The admin can send these to all students at once or to a specific student based on their registered email. Each student has a personalized page where they can view the content sent to them.
Features

Admin Capabilities:
Send exercises, projects, assignments, and announcements to all students.
Select a specific student by their registered email to send targeted content.
Send content to all students simultaneously by selecting the "All" option.


Student Experience:
Each student has a personal page displaying exercises, projects, assignments, and announcements sent to them.
Content is delivered based on the student's registered email.


Email-Based System:
Students sign up with their email, which the admin uses to identify and send content to individual students.



Setup Instructions

Clone the Repository:git clone <repository-url>
cd classroom-management-system


Install Dependencies:Ensure you have a backend (e.g., Node.js, Python) and a database (e.g., MongoDB, MySQL) set up. Install required dependencies:npm install  # For Node.js-based projects
# or
pip install -r requirements.txt  # For Python-based projects


Configure Environment:
Create a .env file in the root directory.
Add necessary configurations (e.g., database connection string, email service credentials).

DATABASE_URL=<your-database-url>
EMAIL_SERVICE=<your-email-service>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>


Run the Application:npm start  # For Node.js
# or
python app.py  # For Python



Usage

Admin Actions:
Log in to the admin dashboard.
Navigate to the "Send Content" section.
Choose the content type: Exercise, Project, Assignment, or Announcement.
Select recipient(s): "All" for all students or a specific student's email from the registered list.
Submit the content, which will be sent to the selected student(s) and appear on their personal page(s).


Student Actions:
Sign up with a valid email address.
Access the personal student page via a provided link or login.
View all exercises, projects, assignments, and announcements sent by the admin.



Technology Stack

Frontend: HTML, CSS, JavaScript (optional: React for a dynamic UI)
Backend: Node.js with Express or Python with Flask/Django
Database: MongoDB for storing student emails and content (or MySQL/PostgreSQL)
Email Service: SMTP or third-party service (e.g., SendGrid, Nodemailer)

Project Structure
classroom-management-system/
├── public/                # Static files (CSS, JS, images)
├── src/
│   ├── controllers/       # Logic for handling admin and student actions
│   ├── models/            # Database models (e.g., Student, Content)
│   ├── routes/            # API routes for sending content
│   └── views/             # Frontend templates (if using server-side rendering)
├── .env                   # Environment variables
├── README.md              # This file
└── package.json           # Node.js dependencies (or requirements.txt for Python)

Future Enhancements

Add authentication for secure admin and student access.
Implement real-time notifications for new content.
Allow students to submit assignments through their personal page.
Add support for file uploads (e.g., PDFs for assignments).

Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
License
This project is licensed under the MIT License.

<!-- image kit  learn that later--




import React, { useState, useEffect } from "react";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import useManageStore from "../Store/useManageStore";
import Admini from "./Admini";
import Administra from "./Administra";
import Adminis from "./Adminis";

const Administrator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});

  // Store selectors
  const announcements = useManageStore((state) => state.announcements);
  const events = useManageStore((state) => state.events);
  const assignments = useManageStore((state) => state.assignments);
  const exercises = useManageStore((state) => state.exercises);
  const projects = useManageStore((state) => state.projects);
  const attendance = useManageStore((state) => state.attendance);
  const roadmapItems = useManageStore((state) => state.roadmapItems);
  const classMaterials = useManageStore((state) => state.classMaterials);
  const programs = useManageStore((state) => state.programs);
  const friendRequests = useManageStore((state) => state.friendRequests);
  const directory = useManageStore((state) => state.directory);

  // Store actions
  const addAnnouncement = useManageStore((state) => state.addAnnouncement);
  const updateAnnouncement = useManageStore(
    (state) => state.updateAnnouncement
  );
  const deleteAnnouncement = useManageStore(
    (state) => state.deleteAnnouncement
  );
  const addEvent = useManageStore((state) => state.addEvent);
  const updateEvent = useManageStore((state) => state.updateEvent);
  const deleteEvent = useManageStore((state) => state.deleteEvent);
  const addAssignment = useManageStore((state) => state.addAssignment);
  const updateAssignment = useManageStore((state) => state.updateAssignment);
  const deleteAssignment = useManageStore((state) => state.deleteAssignment);
  const addExercise = useManageStore((state) => state.addExercise);
  const updateExercise = useManageStore((state) => state.updateExercise);
  const deleteExercise = useManageStore((state) => state.deleteExercise);
  const addProject = useManageStore((state) => state.addProject);
  const updateProject = useManageStore((state) => state.updateProject);
  const deleteProject = useManageStore((state) => state.deleteProject);
  const addAttendance = useManageStore((state) => state.addAttendance);
  const updateAttendance = useManageStore((state) => state.updateAttendance);
  const deleteAttendance = useManageStore((state) => state.deleteAttendance);
  const addRoadmapItem = useManageStore((state) => state.addRoadmapItem);
  const updateRoadmapItem = useManageStore((state) => state.updateRoadmapItem);
  const deleteRoadmapItem = useManageStore((state) => state.deleteRoadmapItem);
  const addWeekToRoadmap = useManageStore((state) => state.addWeekToRoadmap);
  const addSubTopicToWeek = useManageStore((state) => state.addSubTopicToWeek);
  const toggleSubTopicComplete = useManageStore(
    (state) => state.toggleSubTopicComplete
  );
  const deleteSubTopic = useManageStore((state) => state.deleteSubTopic);
  const setCurrentWeek = useManageStore((state) => state.setCurrentWeek);
  const addClassMaterial = useManageStore((state) => state.addClassMaterial);
  const updateClassMaterial = useManageStore(
    (state) => state.updateClassMaterial
  );
  const deleteClassMaterial = useManageStore(
    (state) => state.deleteClassMaterial
  );
  const addProgram = useManageStore((state) => state.addProgram);
  const updateProgram = useManageStore((state) => state.updateProgram);
  const deleteProgram = useManageStore((state) => state.deleteProgram);
  const addMilestoneToProgram = useManageStore(
    (state) => state.addMilestoneToProgram
  );
  const adminToggleMilestoneComplete = useManageStore(
    (state) => state.adminToggleMilestoneComplete
  );
  const approveJoinRequest = useManageStore(
    (state) => state.approveJoinRequest
  );
  const rejectJoinRequest = useManageStore((state) => state.rejectJoinRequest);
  const acceptFriendRequest = useManageStore((state) => state.acceptFriendRequest);
  const rejectFriendRequest = useManageStore((state) => state.rejectFriendRequest);

  // Debug log
  useEffect(() => {
    console.log("Administrator - Announcements:", announcements);
    console.log("Administrator - Assignments:", assignments);
    console.log("Administrator - Exercises:", exercises);
    console.log("Administrator - Projects:", projects);
    console.log("Administrator - Attendance:", attendance);
    console.log("Administrator - Roadmap Items:", roadmapItems);
    console.log("Administrator - Class Materials:", classMaterials);
    console.log("Administrator - Programs:", programs);
  }, [
    announcements,
    assignments,
    exercises,
    projects,
    attendance,
    roadmapItems,
    classMaterials,
    programs,
  ]);

  const recentStudents = [
    {
      id: 1,
      name: "Julius Dagana",
      email: "julius@example.com",
      cohort: "2024-B",
      status: "active",
      attendance: 92,
    },
  ];

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

  const adminId = 2; // Hardcoded admin ID

  const pendingFriendRequests = friendRequests.filter(
    (r) => r.toId === adminId && r.status === "pending"
  );

  const getStudentName = (studentId) => {
    return recentStudents.find((s) => s.id === studentId)?.name || `Student ${studentId}`;
  };

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
      case "roadmap": {
        if (!formData.phase || !formData.term || !formData.status) {
          alert("Please fill in all required fields (Phase, Term, Status).");
          return;
        }
        const newRoadmapItem = {
          id: newId(roadmapItems),
          phase: formData.phase,
          term: formData.term,
          status: formData.status,
          weeks: [],
        };
        addRoadmapItem(newRoadmapItem);
        alert("Roadmap item added successfully!");
        break;
      }
      case "roadmap-edit": {
        if (!formData.phase || !formData.term || !formData.status) {
          alert("Please fill in all required fields (Phase, Term, Status).");
          return;
        }
        updateRoadmapItem(formData.id, {
          phase: formData.phase,
          term: formData.term,
          status: formData.status,
        });
        alert("Roadmap item updated successfully!");
        break;
      }
      case "week": {
        if (!formData.roadmapId || !formData.weekNumber || !formData.topic) {
          alert(
            "Please fill in all required fields (Roadmap ID, Week Number, Topic)."
          );
          return;
        }
        const weekNumber = parseInt(formData.weekNumber);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          alert("Please enter a valid week number.");
          return;
        }
        addWeekToRoadmap(formData.roadmapId, weekNumber, formData.topic);
        alert("Week added successfully!");
        break;
      }
      case "subtopic": {
        if (
          !formData.roadmapId ||
          !formData.weekIndex ||
          !formData.subTopicName
        ) {
          alert(
            "Please fill in all required fields (Roadmap ID, Week Index, Subtopic Name)."
          );
          return;
        }
        const weekIndex = parseInt(formData.weekIndex);
        if (isNaN(weekIndex) || weekIndex < 0) {
          alert("Please enter a valid week index.");
          return;
        }
        addSubTopicToWeek(formData.roadmapId, weekIndex, formData.subTopicName);
        alert("Subtopic added successfully!");
        break;
      }
      case "classmaterial":
      case "classmaterial-edit": {
        if (
          !formData.title ||
          !formData.week ||
          !formData.resources ||
          !formData.topics
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const weekNum = parseInt(formData.week);
        const resourcesNum = parseInt(formData.resources);
        if (
          isNaN(weekNum) ||
          weekNum <= 0 ||
          isNaN(resourcesNum) ||
          resourcesNum <= 0
        ) {
          alert("Please enter valid numbers for week and resources.");
          return;
        }
        const topics = formData.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        if (topics.length === 0) {
          alert("Please enter at least one topic.");
          return;
        }
        const materialData = {
          title: formData.title,
          week: weekNum,
          resources: resourcesNum,
          topics,
          files: [], // Placeholder for files; can be extended later
        };
        if (selectedForm === "classmaterial") {
          const newMaterial = {
            id: newId(classMaterials),
            ...materialData,
          };
          addClassMaterial(newMaterial);
          alert("Class material added successfully! Student will see it now.");
        } else {
          updateClassMaterial(formData.id, materialData);
          alert("Class material updated successfully!");
        }
        break;
      }
      case "program":
      case "program-edit": {
        if (
          !formData.name ||
          !formData.description ||
          !formData.totalMilestones
        ) {
          alert(
            "Please fill in all required fields (Name, Description, Total Milestones)."
          );
          return;
        }
        const totalMilestones = parseInt(formData.totalMilestones);
        if (isNaN(totalMilestones) || totalMilestones <= 0) {
          alert("Please enter a valid number for total milestones.");
          return;
        }
        if (selectedForm === "program") {
          const newProgram = {
            id: newId(programs),
            name: formData.name,
            description: formData.description,
            totalMilestones,
            milestones: [],
            pendingRequests: [],
            enrolledStudents: [],
          };
          addProgram(newProgram);
          alert("Program added successfully!");
        } else {
          updateProgram(formData.id, {
            name: formData.name,
            description: formData.description,
            totalMilestones,
          });
          alert("Program updated successfully!");
        }
        break;
      }
      case "milestone": {
        if (!formData.programId || !formData.milestoneName) {
          alert(
            "Please fill in all required fields (Program ID and Milestone Name)."
          );
          return;
        }
        const programId = parseInt(formData.programId);
        const program = programs.find((p) => p.id === programId);
        if (!program) {
          alert("Program not found.");
          return;
        }
        if (program.milestones.length >= program.totalMilestones) {
          alert("Maximum milestones reached for this program.");
          return;
        }
        addMilestoneToProgram(programId, formData.milestoneName);
        alert("Milestone added successfully!");
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

  const getFormTitle = (formType, hasId) => {
    const titles = {
      announcement: "New Announcement",
      "announcement-edit": "Edit Announcement",
      assignment: "New Assignment",
      "assignment-edit": "Edit Assignment",
      exercise: "New Exercise",
      "exercise-edit": "Edit Exercise",
      project: "New Project",
      "project-edit": "Edit Project",
      event: hasId ? "Edit Event" : "New Event",
      attendance: "New Attendance",
      "attendance-edit": "Edit Attendance",
      roadmap: "New Roadmap Item",
      "roadmap-edit": "Edit Roadmap Item",
      week: "New Week",
      subtopic: "New Subtopic",
      classmaterial: "New Class Material",
      "classmaterial-edit": "Edit Class Material",
      program: "New Program",
      "program-edit": "Edit Program",
      milestone: "New Milestone",
    };
    return titles[formType] || "Edit Item";
  };

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
      case "roadmap":
      case "roadmap-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Phase *
              </label>
              <input
                type="text"
                value={formData.phase || ""}
                onChange={(e) => handleFormChange("phase", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Term *</label>
              <input
                type="text"
                value={formData.term || ""}
                onChange={(e) => handleFormChange("term", e.target.value)}
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
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        );
      case "week":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Roadmap ID *
              </label>
              <input
                type="number"
                value={formData.roadmapId || ""}
                onChange={(e) => handleFormChange("roadmapId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the roadmap to add the week to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Week Number *
              </label>
              <input
                type="number"
                value={formData.weekNumber || ""}
                onChange={(e) => handleFormChange("weekNumber", e.target.value)}
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
          </div>
        );
      case "subtopic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Roadmap ID *
              </label>
              <input
                type="number"
                value={formData.roadmapId || ""}
                onChange={(e) => handleFormChange("roadmapId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the roadmap containing the week.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Week Index *
              </label>
              <input
                type="number"
                value={formData.weekIndex || ""}
                onChange={(e) => handleFormChange("weekIndex", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the index of the week (0-based) to add the subtopic to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Subtopic Name *
              </label>
              <input
                type="text"
                value={formData.subTopicName || ""}
                onChange={(e) =>
                  handleFormChange("subTopicName", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "classmaterial":
      case "classmaterial-edit":
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
              <label className="block text-gray-400 text-sm mb-2">Week *</label>
              <input
                type="number"
                value={formData.week || ""}
                onChange={(e) => handleFormChange("week", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Number of Resources *
              </label>
              <input
                type="number"
                value={formData.resources || ""}
                onChange={(e) => handleFormChange("resources", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topics (comma separated) *
              </label>
              <textarea
                value={formData.topics || ""}
                onChange={(e) => handleFormChange("topics", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="3"
                placeholder="e.g., JavaScript Basics, React Components"
                required
              />
            </div>
          </div>
        );
      case "program":
      case "program-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Total Milestones *
              </label>
              <input
                type="number"
                value={formData.totalMilestones || ""}
                onChange={(e) =>
                  handleFormChange("totalMilestones", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
                placeholder="e.g., 5"
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the total number of milestones for this program.
              </p>
            </div>
          </div>
        );
      case "milestone":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Program ID *
              </label>
              <input
                type="number"
                value={formData.programId || ""}
                onChange={(e) => handleFormChange("programId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the program to add the milestone to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Milestone Name *
              </label>
              <input
                type="text"
                value={formData.milestoneName || ""}
                onChange={(e) =>
                  handleFormChange("milestoneName", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleAcceptFriendRequest = (requestId) => {
    acceptFriendRequest(requestId);
    alert("Friend request accepted!");
  };

  const handleRejectFriendRequest = (requestId) => {
    rejectFriendRequest(requestId);
    alert("Friend request rejected!");
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <Admini
        stats={stats}
        StatIcon={StatIcon}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedForm={selectedForm}
        setSelectedForm={setSelectedForm}
        setFormData={setFormData}
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        renderForm={renderForm}
        getFormTitle={getFormTitle}
        events={events}
        handleEditEvent={handleEditEvent}
        deleteEvent={deleteEvent}
        pendingActions={pendingActions}
        announcements={announcements}
        handleEditAnnouncement={handleEditAnnouncement}
        deleteAnnouncement={deleteAnnouncement}
      />
      <Administra
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedForm={setSelectedForm}
        setFormData={setFormData}
        formData={formData}
        recentStudents={recentStudents}
        assignments={assignments}
        exercises={exercises}
        projects={projects}
      />
      <Adminis
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedForm={setSelectedForm}
        setFormData={setFormData}
        formData={formData}
        recentStudents={recentStudents}
        attendance={attendance}
        roadmapItems={roadmapItems}
        classMaterials={classMaterials}
        programs={programs}
      />
      {activeTab === "friends" && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
          <h2 className="text-white text-xl font-bold mb-4">Manage Friend Requests</h2>
          {pendingFriendRequests.length > 0 ? (
            pendingFriendRequests.map((req) => (
              <div
                key={req.id}
                className="flex justify-between items-center p-4 bg-gray-700 rounded mb-2"
              >
                <span className="text-white">
                  Friend request from {getStudentName(req.fromId)} (ID: {req.fromId})
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAcceptFriendRequest(req.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectFriendRequest(req.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending friend requests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Administrator;