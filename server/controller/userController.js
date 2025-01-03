import User from "../modals/UserModal.js";
import Complaint from "../modals/ComplaintModal.js";
import Guest from "../modals/GuestModal.js";
import mongoose from "mongoose";

export const getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const staff = await User.countDocuments({ role: 'staff' });
    const admin = await User.countDocuments({ role: 'admin' });

    res.json({
      total,
      staff,
      admin
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email firstName lastName role');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('inmates');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(req.params.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated complaints
    await Complaint.deleteMany({ 'user.googleId': user.googleId }).session(session);

    // Delete associated guests
    await Guest.deleteMany({ 'user.googleId': user.googleId }).session(session);

    // Delete user
    await User.findByIdAndDelete(req.params.userId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};