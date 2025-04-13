const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { 
      serviceId, 
      variant,
      startDate, 
      endDate,
      time,
      guests,
      totalPrice,
      totalPoints
    } = req.body;

    // Validate required fields
    if (!serviceId || !variant || !startDate || !endDate || !time || !guests || !totalPrice) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['serviceId', 'variant', 'startDate', 'endDate', 'time', 'guests', 'totalPrice']
      });
    }

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get user details
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough points if they're using points
    if (totalPoints > 0 && user.loyaltyPoints < totalPoints) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      variant,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      time,
      guests,
      totalPrice,
      totalPoints
    });

    await booking.save();

    // Update user's points if points were used
    if (totalPoints > 0) {
      user.loyaltyPoints -= totalPoints;
      await user.save();
    }

    // Calculate and add points earned from the booking
    const pointsEarned = calculatePointsEarned(service, variant, guests, user.membershipTier);
    user.loyaltyPoints += pointsEarned;
    await user.save();

    res.status(201).json({
      booking,
      pointsEarned,
      message: `Booking successful! You earned ${pointsEarned} loyalty points.`
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
};

// Helper function to calculate points earned
const calculatePointsEarned = (service, variant, guests, membershipTier) => {
  // Base points from service
  let points = service.rewardPoints || 0;

  // Add points from variant if available
  const selectedVariant = service.variants.find(v => v.name === variant);
  if (selectedVariant) {
    points += (selectedVariant.pointsPerGuest || 0) * guests;
    points += selectedVariant.bonusPoints || 0;
  }

  // Apply membership tier multiplier
  const tierMultipliers = {
    'Bronze': 1,
    'Silver': 1.2,
    'Gold': 1.5,
    'Platinum': 2
  };

  return Math.floor(points * (tierMultipliers[membershipTier] || 1));
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service')
      .sort('-createdAt');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Deduct points if booking was paid
    if (booking.paymentStatus === 'Paid') {
      const user = await User.findById(req.user._id);
      user.loyaltyPoints -= booking.pointsEarned;
      await user.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus
}; 