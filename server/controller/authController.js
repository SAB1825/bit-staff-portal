import dotenv from "dotenv"

dotenv.config()


const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_CLIENT_URL

export const loginSuccess = async (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: 'User authenticated',
            user: {
                ...req.user.toObject(),
                profileImage: req.user.profileImage
            },
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
};

export const handleAuthFailure = (req, res) => {
    res.redirect(`${NEXT_PUBLIC_URL}/unauthorized`);
};
export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); 
      
        res.json({ success: true, message: 'User logged out' });
    });
};
