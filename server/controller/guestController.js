import Activity from "../modals/ActivityModal.js";
import Guest from "../modals/GuestModal.js";
import User from "../modals/UserModal.js";

export const createGuest = async (req, res) => {
  try {
    const { count, checkIn, checkOut, phoneNo } = req.body;
    console.log(req.body);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const guest = new Guest({
      count,
      checkIn,
      checkOut,
      phoneNo,
      user: {
        googleId: req.user.googleId,
        email: req.user.email,
        username: req.user.username
      }
    });

    await guest.save();
    await Activity.create({
      user: req.user,
      type: 'GUEST_CREATED',
      description: `New guest booking created for ${count} people`
    });
    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      guest,
    });
  } catch (error) {
    console.error('Error creating Guest:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Guest',
      error: error.message,
    });
  }
};

export const getStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayCheckIns, todayCheckOuts, monthlyGuests] = await Promise.all([
      Guest.find({
        checkIn: {
          $gte: today,
          $lt: tomorrow
        },
        "user.googleId": req.user.googleId
      }),

      Guest.find({
        checkOut: {
          $gte: today,
          $lt: tomorrow
        },
        "user.googleId": req.user.googleId
      }),

      Guest.find({
        checkIn: {
          $gte: firstDayOfMonth,
          $lt: tomorrow
        },
        "user.googleId": req.user.googleId
      })
    ]);

    const calculateTotalGuests = (guests) => {
      return guests.reduce((sum, guest) => sum + Number(guest.count), 0);
    };

    const stats = {
      todayCheckIns: {
        totalGuests: calculateTotalGuests(todayCheckIns),
        bookingsCount: todayCheckIns.length
      },
      todayCheckOuts: {
        totalGuests: calculateTotalGuests(todayCheckOuts),
        bookingsCount: todayCheckOuts.length
      },
      monthlyStats: {
        totalGuests: calculateTotalGuests(monthlyGuests),
        bookingsCount: monthlyGuests.length
      }
    };
    console.log("FROM STATS", stats)
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting guest stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guest statistics',
      error: error.message
    });
  }
};

export const getGuests = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({
              success: false,
              message: 'User not authenticated'
          });
      }

      const userGoogleId = req.user.googleId;
      const guests = await Guest.find({
          'user.googleId': userGoogleId
      }).sort({ createdAt: -1 }).lean();
      
      return res.status(200).json({
          success: true,
          data: guests
      });
  } catch (error) {
      console.error('Error fetching guests:', error);
      res.status(500).json({
          success: false,
          message: 'Error fetching guest',
          error: error.message,
      });
  }
}

export const getGuestById = async (req, res) => {
  try {
    const { guestId } = req.params;
    const guest = await Guest.findOne({
      guestId,
    });

    if(!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }
    res.json(guest)
  } catch (error) {
    console.error('Error fetching guest:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching guest',
      error: error.message,
    });
  }
}

export const deleteGuest = async (req,res) => {
  try {
    const { guestId } = req.params;
    if(!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const guest = await Guest.findOneAndDelete({
      guestId,
    })

    if(!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found or unauthorized'
      });
    }
    res.json({
      success: true,
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting guest',
      error: error.message
    });
  }
}

export const updateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { count , checkIn, checkOut, phoneNo } = req.body;
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }


    const guest = await Guest.findOne({
      guestId,
      'user.googleId': req.user.googleId // Ensure user owns the complaint
    })

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'guest not found or unauthorized'
      });
    }

    guest.count = count || guest.count;
    guest.checkIn = checkIn || guest.checkIn;
    guest.checkOut = checkOut || guest.checkOut;
    guest.phoneNo = phoneNo || guest.phoneNo;

    const updatedGuest = await guest.save();

    res.json({
      success: true,
      message: 'guest updated successfully',
      complaint: updatedGuest
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating guest',
      error: error.message
    }); 
  }
}

export const getAllGuestStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayCheckIns, todayCheckOuts, monthlyGuests] = await Promise.all([
      Guest.find({
        checkIn: {
          $gte: today,
          $lt: tomorrow
        },
      }),

      Guest.find({
        checkOut: {
          $gte: today,
          $lt: tomorrow
        },
      }),

      Guest.find({
        checkIn: {
          $gte: firstDayOfMonth,
          $lt: tomorrow
        },
      })
    ]);

    const calculateTotalGuests = (guests) => {
      return guests.reduce((sum, guest) => sum + Number(guest.count), 0);
    };

    const stats = {
      todayCheckIns: {
        totalGuests: calculateTotalGuests(todayCheckIns),
        bookingsCount: todayCheckIns.length
      },
      todayCheckOuts: {
        totalGuests: calculateTotalGuests(todayCheckOuts),
        bookingsCount: todayCheckOuts.length
      },
      monthlyStats: {
        totalGuests: calculateTotalGuests(monthlyGuests),
        bookingsCount: monthlyGuests.length
      }
    };
    console.log("FROM STATS", stats)
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting all guest stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all guest statistics',
      error: error.message
    });
  }
}

export const getAllGuests = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({
              success: false,
              message: 'User not authenticated'
          });
      }

      const guests = await Guest.find({}).populate('user').sort({ createdAt: -1 }).lean();
      
      return res.status(200).json({
          success: true,
          data: guests
      });
  } catch (error) {
      console.error('Error fetching guests:', error);
      res.status(500).json({
          success: false,
          message: 'Error fetching guest',
          error: error.message,
      });
  }
}

export const getTodayGuestCheckIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckIns = await Guest.find({
      checkIn: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('user').lean();

    res.status(200).json({
      success: true,
       data: todayCheckIns
    });
  } catch (error) {
    console.error('Error fetching today\'s check-ins:', error);
    res.status(500).json({
      message: 'Error fetching today\'s check-ins',
      error: error.message
    });
  }
};