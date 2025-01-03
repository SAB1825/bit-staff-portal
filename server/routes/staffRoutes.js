import express from 'express';
import {  getUserProfile  } from '../controller/staffController.js';
import {isAuthenticated} from '../config/middleware.js';

const router = express.Router();

router.get('/profile', isAuthenticated, getUserProfile);



export default router;