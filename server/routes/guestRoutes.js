import express from "express"
import {isAuthenticated} from "../config/middleware.js";
import { createGuest, deleteGuest, getAllGuests, getAllGuestStats, getGuestById, getGuests, getStats, getTodayGuestCheckIn, updateGuest } from "../controller/guestController.js";
const router = express.Router();
router.get('/stats', isAuthenticated, getStats)
router.get('/all-stats', getAllGuestStats)
router.post('/', isAuthenticated, createGuest);
router.get('/', isAuthenticated, getGuests)
router.get('/all-guest', isAuthenticated, getAllGuests)
router.get('/today-check-in', isAuthenticated, getTodayGuestCheckIn)
router.get('/:guestId', isAuthenticated, getGuestById)  
router.put('/:guestId', isAuthenticated, updateGuest)
router.delete('/:guestId', isAuthenticated, deleteGuest)
export default router;
