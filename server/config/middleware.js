import User from '../modals/UserModal.js';

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized user' });
};

const isStaff = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user || user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied: Staff only' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const user = await User.findOne({ googleId: req.user.googleId });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { isAuthenticated, isStaff, isAdmin };