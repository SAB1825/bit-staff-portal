import express from 'express';
import { createFormLink, submitStaffForm } from '../controller/formController.js';
import { isAdmin, isAuthenticated } from '../config/middleware.js';

const router = express.Router();

router.post('/create-form',  createFormLink);
router.post('/submit/:token', submitStaffForm);

export default router;