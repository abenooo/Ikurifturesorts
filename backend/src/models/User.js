const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Activity = require('./Activity');

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
  loyaltyPoints: {
    type: Number,
    default: 10000 // Available points for redemption
  },
  totalEarnedPoints: {
    type: Number,
    default: 10000 // Total points earned since joining
  },
  membershipTier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
    default: 'Bronze'
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
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
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

// Method to update membership tier based on total earned points
userSchema.methods.updateMembershipTier = function() {
  if (this.totalEarnedPoints >= 10000) {
    this.membershipTier = 'Platinum';
  } else if (this.totalEarnedPoints >= 5000) {
    this.membershipTier = 'Gold';
  } else if (this.totalEarnedPoints >= 2500) {
    this.membershipTier = 'Silver';
  } else {
    this.membershipTier = 'Bronze';
  }
};

// Method to add loyalty points
userSchema.methods.addLoyaltyPoints = async function(points, description = 'Points earned') {
  this.loyaltyPoints += points;
  this.totalEarnedPoints += points;
  
  // Create activity record
  await Activity.create({
    user: this._id,
    type: 'earned',
    amount: points,
    description
  });
  
  await this.updateMembershipTier();
  await this.save();
};

// Method to redeem points
userSchema.methods.redeemPoints = async function(points, description = 'Points redeemed') {
  if (this.loyaltyPoints < points) {
    throw new Error('Insufficient points');
  }
  this.loyaltyPoints -= points;
  
  // Create activity record
  await Activity.create({
    user: this._id,
    type: 'redeemed',
    amount: points,
    description
  });
  
  await this.updateMembershipTier();
  await this.save();
};

// Calculate points from service price
userSchema.methods.calculatePointsFromService = function(servicePrice) {
  const pointsMultiplier = {
    Bronze: 10,
    Silver: 12,
    Gold: 15,
    Platinum: 20
  };
  
  return Math.floor(servicePrice * pointsMultiplier[this.membershipTier]);
};

module.exports = mongoose.model('User', userSchema); 