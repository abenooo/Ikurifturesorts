const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

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
        membershipTier: user.membershipTier,
        loyaltyPoints: user.loyaltyPoints,
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

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
        membershipTier: user.membershipTier,
        loyaltyPoints: user.loyaltyPoints,
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
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('bookings')
      .populate('rewards');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'email', 'preferences'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();

    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get membership benefits
const getMembershipBenefits = async (req, res) => {
  try {
    const benefits = {
      Bronze: {
        pointsMultiplier: 1.0,
        benefits: ['Basic room discounts', 'Standard check-in/out']
      },
      Silver: {
        pointsMultiplier: 1.2,
        benefits: ['Bronze benefits', 'Room upgrades', 'Priority booking']
      },
      Gold: {
        pointsMultiplier: 1.5,
        benefits: ['Silver benefits', 'Complimentary breakfast', 'Spa discounts']
      },
      Platinum: {
        pointsMultiplier: 2.0,
        benefits: ['Gold benefits', 'VIP check-in', 'Complimentary services', 'Personal concierge']
      }
    };

    res.json(benefits[req.user.membershipTier]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching benefits', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getMembershipBenefits
}; 