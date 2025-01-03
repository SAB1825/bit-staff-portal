import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  code: { 
    type: String,
    required: true,
    length: 6
  },
  email: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 60000) // 30 minutes
  }
});

export default mongoose.model('VerificationCode', verificationCodeSchema);