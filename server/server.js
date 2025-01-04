
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Import models first
import './modals/InmateModal.js';
import './modals/UserModal.js';

// Import routes after models
import authRoutes from "./routes/authRoutes.js";
import complaintsRoutes from "./routes/complaintsRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import activityRoutes from "./routes/activityRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import formRoutes from "./routes/formRoutes.js"
// Import passport config after models
import './config/passport.js';
// ...existing code...
dotenv.config();

const app = express();
const corsOptions = {
    origin: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOptions));


app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'None'
    }
}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/guests', guestRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/users', userRoutes)
app.use('/api/forms', formRoutes)
app.get('/', (req, res) => {
    res.send('Home page');
});

const PORT = process.env.PORT || 5001;
connectDB()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
