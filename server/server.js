
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
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_CLIENT_URL

const app = express();
app.use(cors({
    origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));


app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
        secure: true, 
        httpOnly: true,
        sameSite: 'none', 
        domain: '.sabaris.site' 
    },
    proxy: true 
}));
app.use(express.json());
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
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
