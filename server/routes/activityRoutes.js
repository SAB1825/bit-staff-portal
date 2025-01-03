import express from 'express';
import { getTodayActivities } from '../controller/activityController.js';
import {isAuthenticated} from '../config/middleware.js';

const router = express.Router();

router.get('/today', isAuthenticated, getTodayActivities);

export default router;