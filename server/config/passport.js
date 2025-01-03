import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../modals/UserModal.js';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.NEXT_PUBLIC_API_AUTH_BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                return done(null, false, { message: 'Unauthorized user' });
            }
            user.googleId = profile.id;
            await user.save();
        }
        const firstName = profile.name?.givenName || user.firstName;
        const lastName = profile.name?.familyName || user.lastName;
        const profileImage = profile.photos?.[0]?.value;
        if (user.profileImage !== profileImage || 
            !user.firstName || 
            !user.lastName) {
            
            user.profileImage = profileImage;
            user.firstName = firstName;
            user.lastName = lastName;
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        done(error, null);
    }
}));
