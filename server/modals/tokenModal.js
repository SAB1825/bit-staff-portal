import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000) // 24 hours
  }
});

export default mongoose.model('Token', tokenSchema);