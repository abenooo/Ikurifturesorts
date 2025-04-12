const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user's current points and tier
router.get('/', pointsController.getUserPoints);

// Add points to user
router.post('/add', pointsController.addPoints);

// Get points history
router.get('/history', pointsController.getPointsHistory);

module.exports = router; 