import mongoose from "mongoose";

const inmateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  age: { type: Number, required: true }
});
const userSchema = new mongoose.Schema({
  googleId: { type: String },
  username: { type: String },
  email: { type: String, required: true },
  profileImage: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  aadharNumber: { type: String, unique: true, required: true },
  vehicleNumber: { type: String },
  dateOfBirth: { type: Date, required: true },
  department: { type: String },
  permanentAddress: { type: String },
  age: { type: Number },
  profileCompleted: { type: Boolean, default: false },
  role: { type: String, enum: ['staff', 'admin'], default: 'staff' },
  phoneNumber: { type: String, required: true },
  quarterNumber: { type: String, required: true },
  quarterName: { type: String, required: true },
  inmates: [inmateSchema],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;