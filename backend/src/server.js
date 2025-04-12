const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const pointsRoutes = require('./routes/pointsRoutes');
const greenPointRoutes = require('./routes/greenPointRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kuriftu-loyalty')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/rewards', rewardRoutes);
  app.use('/api/points', pointsRoutes);
  app.use('/api/green-points', greenPointRoutes);
  app.use('/api/reservations', reservationRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 