import express from "express"
import { getUserStats } from "../controller/staffController.js";
import { isAuthenticated } from "../config/middleware.js";
import { deleteUser, getAllUsers, getUserById } from "../controller/userController.js";
const router = express.Router();
router.get('/stats',isAuthenticated, getUserStats)
router.get('/all', getAllUsers)
router.get('/:userId', getUserById)
router.delete('/:userId', deleteUser)
export default router;