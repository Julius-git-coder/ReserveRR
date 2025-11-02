const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "student"], required: true },
  teamId: {
    type: String,
    required: function () {
      return this.role === "admin";
    },
  }, // Only for admins as unique identifier
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.role === "student";
    },
  }, // Reference to admin for students
  studentId: { type: String, unique: true, sparse: true }, // Auto-generated student ID (only for students)
  profileImage: { type: String },
  status: { type: String, enum: ["active", "suspended"], default: "active" }, // Account status
  createdAt: { type: Date, default: Date.now },
});

// Create unique index on teamId for admins only
UserSchema.index(
  { role: 1, teamId: 1 },
  {
    unique: true,
    partialFilterExpression: { role: "admin" },
  }
);

// Index for adminId to optimize student queries
UserSchema.index({ adminId: 1 });

// Index for studentId for quick lookups
UserSchema.index({ studentId: 1 });

// Pre-save hook to auto-generate studentId for students
UserSchema.pre("save", async function (next) {
  // Only generate studentId for students who don't have one yet
  if (this.role === "student" && !this.studentId && this.isNew) {
    try {
      // Find the highest existing studentId for this admin
      const adminStudents = await this.constructor
        .find({
          adminId: this.adminId,
          role: "student",
          studentId: { $exists: true, $ne: null },
        })
        .sort({ studentId: -1 })
        .limit(1);

      let nextNumber = 1;
      if (adminStudents.length > 0 && adminStudents[0].studentId) {
        // Extract number from studentId (format: STU001, STU002, etc.)
        const match = adminStudents[0].studentId.match(/(\d+)$/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      // Generate studentId in format STU001, STU002, etc.
      this.studentId = `STU${String(nextNumber).padStart(3, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model("User", UserSchema);
