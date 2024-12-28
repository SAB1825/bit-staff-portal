import User from '../modals/UserModal.js'; 

export const loginSuccess = async (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: 'User authenticated',
            user: req.user,
        });
    } else {
        const newUser = new User({
            googleId: req.body.googleId, 
            username: req.body.username,   
            email: req.body.email,       
        });
        await newUser.save();
        res.json({
            success: true,
            message: 'User created and authenticated',
            user: newUser,
        });
    }
};

// New logout function
export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); 
      
        res.json({ success: true, message: 'User logged out' });
    });
};