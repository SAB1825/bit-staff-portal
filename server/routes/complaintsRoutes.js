import express from 'express';
import { createComplaint, deleteComplaint, getComplaintById, getComplaints, getComplaintStats, updateComplaint } from '../controller/complaintController.js';
import isAuthenticated from '../config/middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', isAuthenticated, upload.single('image'), createComplaint);
router.get('/stats', isAuthenticated, getComplaintStats);
router.get('/', isAuthenticated, getComplaints);
router.get('/:complaintId', getComplaintById);
router.delete('/:complaintId', isAuthenticated, deleteComplaint);
router.put('/:complaintId', isAuthenticated, upload.single('image'), updateComplaint);
export default router;
