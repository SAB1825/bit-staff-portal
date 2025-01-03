import express from 'express';
import { createComplaint, deleteComplaint, getAllComplaints, getAllComplaintStats, getComplaintById, getComplaints, getComplaintStats, getTodayComplaints, getTodayCreatedComplaints, updateComplaint } from '../controller/complaintController.js';
import {isAuthenticated} from '../config/middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', isAuthenticated, upload.single('image'), createComplaint);
router.get('/stats', isAuthenticated, getComplaintStats);
router.get('/all-stats', isAuthenticated, getAllComplaintStats);
router.get('/', isAuthenticated, getComplaints);
router.get('/today-created', isAuthenticated, getTodayCreatedComplaints)
router.get('/all-complaints', isAuthenticated, getAllComplaints);
router.get('/today', isAuthenticated, getTodayComplaints)
router.get('/:complaintId', getComplaintById);
router.delete('/:complaintId', isAuthenticated, deleteComplaint);
router.put('/:complaintId', isAuthenticated, upload.single('image'), updateComplaint);
export default router;
