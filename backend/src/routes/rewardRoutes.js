const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all available rewards
router.get('/', rewardController.getAvailableRewards);

// Protected routes
router.use(authMiddleware);

// Redeem a reward
router.post('/redeem', rewardController.redeemReward);

// Get user's redeemed rewards
router.get('/my-rewards', rewardController.getUserRewards);

// Mark reward as used
router.put('/:userRewardId/use', rewardController.markRewardAsUsed);

module.exports = router; 