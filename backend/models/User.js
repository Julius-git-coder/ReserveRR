const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], required: true },
  teamId: { type: String, required: function() { return this.role === 'admin' || this.role === 'student'; } },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Create unique index on teamId for admins only
UserSchema.index({ role: 1, teamId: 1 }, { 
  unique: true, 
  partialFilterExpression: { role: 'admin' } 
});

module.exports = mongoose.model('User', UserSchema);

