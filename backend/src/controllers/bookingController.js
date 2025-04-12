const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, numberOfGuests, specialRequests, paymentMethod } = req.body;
    
    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate total price based on membership tier
    const user = await User.findById(req.user._id);
    const basePrice = service.price * numberOfGuests;
    const membershipDiscount = {
      Bronze: 0,
      Silver: 0.1,
      Gold: 0.15,
      Platinum: 0.2
    };
    
    const discount = basePrice * membershipDiscount[user.membershipTier];
    const totalPrice = basePrice - discount;

    // Calculate points earned
    const pointsEarned = user.calculatePointsFromService(totalPrice);

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      date,
      numberOfGuests,
      totalPrice,
      pointsEarned,
      specialRequests,
      paymentMethod
    });

    await booking.save();

    // Update user's bookings and loyalty points
    user.bookings.push(booking._id);
    await user.addLoyaltyPoints(pointsEarned);
    await user.save();

    res.status(201).json({
      booking,
      pointsEarned,
      message: `Booking successful! You earned ${pointsEarned} loyalty points.`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
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