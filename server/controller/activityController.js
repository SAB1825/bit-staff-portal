import Activity from '../modals/ActivityModal.js';

export const getTodayActivities = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activities = await Activity.find({
      'user.googleId': req.user.googleId,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};