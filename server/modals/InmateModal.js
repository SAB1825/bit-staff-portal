import mongoose from 'mongoose';

const inmateSchema = new mongoose.Schema({
  inmateId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
    enum: ['father', 'mother', 'wife', 'husband', 'child', 'other']
  },
  age: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

inmateSchema.pre('save', async function(next) {
  try {
    if (!this.inmateId) {
      const count = await this.constructor.countDocuments();
      const year = new Date().getFullYear();
      this.inmateId = `INMATE-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Inmate = mongoose.model('Inmate', inmateSchema);
export default Inmate;