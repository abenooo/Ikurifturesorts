const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  specialRequests: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Loyalty Points', 'Cash'],
    required: true
  }
}, {
  timestamps: true
});

// Calculate points earned before saving
bookingSchema.pre('save', function(next) {
  if (this.isModified('totalPrice')) {
    this.pointsEarned = Math.floor(this.totalPrice * this.service.pointsMultiplier);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 