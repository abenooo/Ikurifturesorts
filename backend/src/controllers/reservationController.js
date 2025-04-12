const Reservation = require('../models/Reservation');
const User = require('../models/User');

// Link a reservation to a user
const linkReservation = async (req, res) => {
  try {
    const { reservationNumber, lastName, checkInDate, checkOutDate } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if reservation already exists
    const existingReservation = await Reservation.findOne({ reservationNumber });
    if (existingReservation) {
      if (existingReservation.user.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Reservation already linked to another user' });
      }
      return res.status(200).json({ message: 'Reservation already linked', reservation: existingReservation });
    }

    // Create new reservation
    const reservation = new Reservation({
      user: user._id,
      reservationNumber,
      lastName,
      checkInDate,
      checkOutDate,
      status: 'active',
      isLinked: true
    });

    await reservation.save();

    res.status(201).json({
      message: 'Reservation linked successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error linking reservation', error: error.message });
  }
};

// Get user's linked reservations
const getUserReservations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reservations = await Reservation.find({ user: user._id });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

// Get active reservation
const getActiveReservation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activeReservation = await Reservation.findOne({
      user: user._id,
      status: 'active'
    });

    res.json(activeReservation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active reservation', error: error.message });
  }
};

module.exports = {
  linkReservation,
  getUserReservations,
  getActiveReservation
}; 