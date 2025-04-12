const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Accommodation', 'Dining', 'Spa', 'Adventure', 'Wellness'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  pointsMultiplier: {
    type: Number,
    default: 1.0
  },
  availability: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  requirements: [{
    type: String
  }],
  specialOffers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpecialOffer'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema); 