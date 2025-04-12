const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign up a new user
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user (automatically gets 100 points from model default)
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier,
        totalSpent: user.totalSpent,
        membershipSince: user.membershipSince,
        preferences: user.preferences,
        bookings: user.bookings,
        rewards: user.rewards,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Sign in user
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints,
        membershipTier: user.membershipTier,
        totalSpent: user.totalSpent,
        membershipSince: user.membershipSince,
        preferences: user.preferences,
        bookings: user.bookings,
        rewards: user.rewards,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error: error.message });
  }
};

module.exports = {
  signup,
  signin
}; 