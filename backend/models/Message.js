import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, // null = team broadcast or team chat
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Admin who owns the team
  isTeamChat: { type: Boolean, default: false }, // true = team chat room, false = direct message or broadcast
  messageType: {
    type: String,
    enum: [
      "Announcement",
      "Assignment",
      "Attendance",
      "Grading",
      "ClassMaterials",
      "RoadMap",
      "Project",
      "Exercise",
      "Directory",
      "BookSections",
      "WorkReady",
      "DaysOfLearning",
      "General",
      "Direct",
    ],
    default: "General",
  }, // Message type for categorization
  content: { type: String },
  fileUrl: { type: String },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

// Indexes for efficient queries
MessageSchema.index({ adminId: 1, isTeamChat: 1, createdAt: -1 }); // For team chat queries
MessageSchema.index({ adminId: 1, receiverId: 1, createdAt: -1 }); // For team broadcast queries
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 }); // For direct messages
MessageSchema.index({ receiverId: 1, createdAt: -1 });

export default mongoose.model("Message", MessageSchema);
