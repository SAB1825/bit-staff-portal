import express from "express"
import passport from "passport";
import { handleAuthFailure, loginSuccess, logoutUser } from '../controller/authController.js';
import { isAuthenticated } from '../config/middleware.js';
import User from '../modals/UserModal.js';

const router = express.Router();
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_CLIENT_URL

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${NEXT_PUBLIC_URL}/unauthorized`,
}), async (req, res) => {
    try {
        const user = await User.findOne({ googleId: req.user.googleId });
        if (user.role === 'admin') {
            res.redirect(`${NEXT_PUBLIC_URL}/admin`);
        } else {
            res.redirect(`${NEXT_PUBLIC_URL}/staff`);
        }
    } catch (error) {
        res.redirect(`${NEXT_PUBLIC_URL}/unauthorized`);
    }
});

router.get('/check', isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/failure', handleAuthFailure);
router.get('/logout', logoutUser);

export default router;