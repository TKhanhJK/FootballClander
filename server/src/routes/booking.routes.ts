import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller.js';

const router = Router();

router.post('/bookings', (req, res, next) => bookingController.createBooking(req, res, next));
router.get('/bookings', (req, res, next) => bookingController.getBookings(req, res, next));
router.get('/bookings/:id', (req, res, next) => bookingController.getBookingById(req, res, next));
router.patch('/bookings/:id/status', (req, res, next) => bookingController.updateBookingStatus(req, res, next));

export default router;

