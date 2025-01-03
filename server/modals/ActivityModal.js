import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: {
    googleId: String,
    email: String,
    username: String
  },
  type: {
    type: String,
    enum: ['GUEST_CREATED', 'COMPLAINT_CREATED', 'GUEST_UPDATED', 'COMPLAINT_UPDATED']
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Activity', activitySchema);