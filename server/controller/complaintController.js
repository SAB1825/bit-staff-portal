import Complaint from '../modals/ComplaintModal.js';

export const createComplaint = async (req, res) => {
  try {
    const { title, description, availableDate, availableTime } = req.body;
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const complaint = new Complaint({
      title,
      description,
      availableDate,
      availableTime,
      imageUrl: req.file ? req.file.path : undefined,
      user: {
        googleId: req.user.googleId,
        email: req.user.email,
        username: req.user.username
      }
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating complaint',
      error: error.message,
    });
  }
};

export const getComplaintStats = async (req, res) => {
    try {
        const userGoogleId = req.user.googleId;
        
        const total = await Complaint.countDocuments({ 'user.googleId': userGoogleId });
        const inProgress = await Complaint.countDocuments({ 
            'user.googleId': userGoogleId,
            status: 'in-progress' 
        });
        const resolved = await Complaint.countDocuments({ 
            'user.googleId': userGoogleId,
            status: 'resolved' 
        });

        res.json({
            total,
            inProgress,
            resolved
        });
    } catch (error) {
        console.error('Error fetching complaint stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaint statistics',
            error: error.message
        });
    }
};

export const getComplaints = async (req, res) => {
    try {
        const userGoogleId = req.user.googleId;
        
        const complaints = await Complaint.find({ 'user.googleId': userGoogleId })
            .sort({ createdAt: -1 })
            .lean();

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints',
            error: error.message,
        });
    }
};

export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findOne({ 
      complaintId,
      'user.googleId': req.user.googleId 
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complaint',
      error: error.message,
    });
  }
};

// ... existing imports and code ...

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find and delete the complaint
    const complaint = await Complaint.findOneAndDelete({ 
      complaintId,
      'user.googleId': req.user.googleId // Ensure user owns the complaint
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found or unauthorized'
      });
    }

    // If there's an image, delete it from storage (optional)
    if (complaint.imageUrl) {
      // Add your image deletion logic here
      // Example: await deleteFromStorage(complaint.imageUrl);
    }

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting complaint',
      error: error.message
    });
  }
};

// Update complaint
export const updateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { title, description, status, availableDate, availableTime } = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find and update the complaint
    const complaint = await Complaint.findOne({ 
      complaintId,
      'user.googleId': req.user.googleId // Ensure user owns the complaint
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found or unauthorized'
      });
    }

    // Update fields
    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.status = status || complaint.status;
    complaint.availableDate = availableDate || complaint.availableDate;
    complaint.availableTime = availableTime || complaint.availableTime;

    // If there's a new image
    if (req.file) {
      // Optional: Delete old image
      // if (complaint.imageUrl) {
      //   await deleteFromStorage(complaint.imageUrl);
      // }
      complaint.imageUrl = req.file.path;
    }

    // Save the updated complaint
    const updatedComplaint = await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating complaint',
      error: error.message
    });
  }
};