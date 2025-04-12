const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Link a reservation to user
router.post('/link', reservationController.linkReservation);

// Get user's reservations
router.get('/my-reservations', reservationController.getUserReservations);

// Get active reservation
router.get('/active', reservationController.getActiveReservation);

module.exports = router; 