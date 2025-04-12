const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  membershipTier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  membershipSince: {
    type: Date,
    default: Date.now
  },
  preferences: {
    type: Map,
    of: Boolean,
    default: {}
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  rewards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate membership tier based on total spent
userSchema.methods.updateMembershipTier = function() {
  if (this.totalSpent >= 10000) {
    this.membershipTier = 'Platinum';
  } else if (this.totalSpent >= 5000) {
    this.membershipTier = 'Gold';
  } else if (this.totalSpent >= 2000) {
    this.membershipTier = 'Silver';
  } else {
    this.membershipTier = 'Bronze';
  }
};

// Method to add loyalty points
userSchema.methods.addLoyaltyPoints = function(amount) {
  this.loyaltyPoints += amount;
  this.totalSpent += amount;
  this.updateMembershipTier();
};

module.exports = mongoose.model('User', userSchema); 