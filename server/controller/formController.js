import crypto from 'crypto';
import Token from '../modals/tokenModal.js';
import User from '../modals/UserModal.js';

export const createFormLink = async (req, res) => {
  try {
    const { email } = req.body;
    
    const token = crypto.randomBytes(32).toString('hex');
    
    await Token.create({
      token,
      email
    });

    const formUrl = `${process.env.CLIENT_URL}/register/${token}`;

    res.status(200).json({
      success: true,
      formUrl
    });
  } catch (error) {
    console.error('Error creating form link:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitStaffForm = async (req, res) => {
  try {
    const { token } = req.params;
    const formData = req.body;

    const tokenDoc = await Token.findOne({ 
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const user = await User.create({
      ...formData,
      email: tokenDoc.email,
      role: 'staff'
    });

    tokenDoc.isUsed = true;
    await tokenDoc.save();

    res.status(201).json({
      success: true,
      message: 'Staff registration successful'
    });
  } catch (error) {
    console.error('Error submitting staff form:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};