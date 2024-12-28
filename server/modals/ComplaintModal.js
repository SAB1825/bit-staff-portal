import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availableDate: {
    type: Date,
    required: true,
  },
  availableTime: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending',
  },
  user: {
    googleId: {
      type: String,
      required: true,
    },
    email: String,
    username: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the pre-save middleware to handle the complaintId generation
complaintSchema.pre('save', async function(next) {
  try {
    if (!this.complaintId) { // Check if complaintId doesn't exist
      const count = await mongoose.model('Complaint').countDocuments();
      const year = new Date().getFullYear();
      this.complaintId = `COMP-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Complaint', complaintSchema);
