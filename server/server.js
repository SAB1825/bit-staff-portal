import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; 
import authRoutes from "./routes/authRoutes.js"
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import complaintsRoutes from "./routes/complaintsRoutes.js"
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
}));


app.use(session({
    secret: 'bit',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);


app.get('/', (req, res) => {
    res.send('Home page');
});

const PORT = process.env.PORT || 5001;
connectDB()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
