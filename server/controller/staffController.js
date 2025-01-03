import User from "../modals/UserModal.js";


export const getUserProfile = async (req, res) => {
  try {
    const { googleId } = req.user;
    const user = await User.findOne({ googleId })
      .populate('inmates')
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.status(200).json({ 
      ...user.toJSON(),
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
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
