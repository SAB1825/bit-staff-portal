import express from "express"
import passport from "passport";
import { loginSuccess, logoutUser } from '../controller/authController.js';
import isAuthenticated from '../config/middleware.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/sign-in',
}), (req, res) => {
    res.redirect('http://localhost:3000/staff');
});

router.get('/check', isAuthenticated, (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/logout', logoutUser);

export default router;
