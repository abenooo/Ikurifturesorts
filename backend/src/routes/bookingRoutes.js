const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus
} = require('../controllers/bookingController');

// Protected routes
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, cancelBooking);
router.put('/:id/status', auth, updateBookingStatus);

module.exports = router; 