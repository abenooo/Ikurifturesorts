const express = require('express');
const router = express.Router();
const greenPointController = require('../controllers/greenPointController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user's green points
router.get('/my-points', greenPointController.getUserGreenPoints);

// Submit a green action
router.post('/submit', greenPointController.submitGreenAction);

// Get available green actions
router.get('/actions', greenPointController.getGreenActions);

module.exports = router; 