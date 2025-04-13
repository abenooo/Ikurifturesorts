const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      serviceId,
      startDate,
      endDate,
      time,
      guests,
      variant,
      totalPrice,
      totalPoints,
      notes
    } = req.body;

    // Validate required fields
    if (!serviceId || !startDate || !endDate || !time || !guests || !variant || !totalPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required booking fields' 
      });
    }

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: 'Service not found' 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date must be after start date' 
      });
    }

    // Validate guests count
    if (guests < 1 || guests > service.maxGuests) {
      return res.status(400).json({ 
        success: false, 
        message: `Number of guests must be between 1 and ${service.maxGuests}` 
      });
    }

    // Create new booking
    const booking = new Booking({
      service: serviceId,
      user: req.user._id,
      startDate: start,
      endDate: end,
      time,
      guests,
      variant,
      totalPrice,
      totalPoints: totalPoints || 0,
      notes: notes || '',
      status: 'pending'
    });

    await booking.save();

    // Update user's points if applicable
    if (totalPoints > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { loyaltyPoints: totalPoints }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating booking',
      error: error.message 
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'name description images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bookings',
      error: error.message 
    });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name description images');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this booking' 
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching booking',
      error: error.message 
    });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this booking' 
      });
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only pending bookings can be cancelled' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error cancelling booking',
      error: error.message 
    });
  }
});

// Update booking status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update booking status' 
      });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating booking status',
      error: error.message 
    });
  }
});

module.exports = router; 