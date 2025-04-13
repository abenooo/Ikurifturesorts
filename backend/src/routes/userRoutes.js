const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getMembershipBenefits
} = require('../controllers/userController');
const Activity = require('../models/Activity');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Redemption = require('../models/Redemption');

// Public routes
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      loyaltyPoints: 10000, // Welcome bonus points
      membershipTier: 'Bronze'
    });

    await user.save();

    // Create welcome bonus activity
    const activity = new Activity({
      user: user._id,
      type: 'earned',
      amount: 1000,
      description: 'Welcome Bonus',
      date: new Date()
    });

    await activity.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if this is first login (no activities exist)
    const existingActivities = await Activity.find({ user: user._id });
    if (existingActivities.length === 0) {
      // Create welcome bonus activity for first login
      const activity = new Activity({
        user: user._id,
        type: 'earned',
        amount: 10000,
        description: 'Welcome Bonus',
        date: new Date()
      });

      await activity.save();

      // Update user points
      user.loyaltyPoints = 1000;
      await user.save();
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/membership-benefits', authMiddleware, getMembershipBenefits);

// Get user activities
router.get('/activities', authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Create new activity
router.post('/activities', authMiddleware, async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    
    if (!type || !amount || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const activity = new Activity({
      user: req.user._id,
      type,
      amount,
      description,
      date: new Date()
    });

    await activity.save();
    
    res.status(201).json({ message: 'Activity created successfully', activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Error creating activity' });
  }
});

// Get user's bookings
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get user's redemptions
router.get('/redemptions', authMiddleware, async (req, res) => {
  try {
    const redemptions = await Redemption.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json({ redemptions });
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ message: 'Error fetching redemptions' });
  }
});

module.exports = router; 