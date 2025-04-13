const Reward = require('../models/Reward');
const UserReward = require('../models/UserReward');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');


// Get all available rewards
const getAvailableRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ isActive: true });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rewards', error: error.message });
  }
};

// Redeem a reward
const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const user = await User.findById(req.user._id);
    const reward = await Reward.findById(rewardId);

    if (!reward || !reward.isActive) {
      return res.status(404).json({ message: 'Reward not found or inactive' });
    }

    if (user.loyaltyPoints < reward.pointsCost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    if (reward.quantity === 0) {
      return res.status(400).json({ message: 'Reward out of stock' });
    }

    // Create user reward
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + reward.validityPeriod);

    const userReward = new UserReward({
      user: user._id,
      reward: reward._id,
      pointsSpent: reward.pointsCost,
      expiryDate
    });

    // Update reward quantity if not unlimited
    if (reward.quantity > 0) {
      reward.quantity -= 1;
      await reward.save();
    }

    // Deduct points from user
    user.loyaltyPoints -= reward.pointsCost;
    await user.save();

    await userReward.save();

    res.status(201).json({
      message: 'Reward redeemed successfully',
      userReward
    });
  } catch (error) {
    res.status(500).json({ message: 'Error redeeming reward', error: error.message });
  }
};

// Get user's redeemed rewards
const getUserRewards = async (req, res) => {
  try {
    const userRewards = await UserReward.find({ user: req.user._id })
      .populate('reward')
      .sort('-createdAt');
    
    res.json(userRewards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user rewards', error: error.message });
  }
};

// Mark reward as used
const markRewardAsUsed = async (req, res) => {
  try {
    const { userRewardId } = req.params;
    const userReward = await UserReward.findById(userRewardId);

    if (!userReward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    if (userReward.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (userReward.status !== 'Active') {
      return res.status(400).json({ message: 'Reward is not active' });
    }

    userReward.status = 'Used';
    await userReward.save();

    res.json({ message: 'Reward marked as used', userReward });
  } catch (error) {
    res.status(500).json({ message: 'Error updating reward status', error: error.message });
  }
};

module.exports = {
  getAvailableRewards,
  redeemReward,
  getUserRewards,
  markRewardAsUsed
}; 