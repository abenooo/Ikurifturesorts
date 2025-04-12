const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pointsCost: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Room Upgrade', 'Dining', 'Spa', 'Activity', 'Other'],
    required: true
  },
  validityPeriod: {
    type: Number, // in days
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: -1 // -1 means unlimited
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reward', rewardSchema); 