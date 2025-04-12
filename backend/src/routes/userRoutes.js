const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getMembershipBenefits
} = require('../controllers/userController');
const Activity = require('../models/Activity');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/membership-benefits', auth, getMembershipBenefits);

// Get user activities
router.get('/activities', auth, async (req, res) => {
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
router.post('/activities', auth, async (req, res) => {
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

module.exports = router; 