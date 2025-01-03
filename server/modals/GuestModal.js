import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  guestId: {
    type: String,
    unique: true,
  },
  count: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
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

guestSchema.pre('save', async function(next) {
  try {
    if (!this.guestId) { // Check if complaintId doesn't exist
      const count = await mongoose.model('Guest').countDocuments();
      const year = new Date().getFullYear();
      this.guestId = `GUEST-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Guest', guestSchema);
