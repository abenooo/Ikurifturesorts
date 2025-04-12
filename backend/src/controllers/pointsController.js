const User = require('../models/User');

// Get user's current points and tier
const getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('loyaltyPoints membershipTier');
    
    res.json({
      loyaltyPoints: user.loyaltyPoints,
      membershipTier: user.membershipTier,
      nextTier: getNextTier(user.membershipTier),
      pointsToNextTier: calculatePointsToNextTier(user.loyaltyPoints, user.membershipTier)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching points', error: error.message });
  }
};

// Add points to user (can be called from frontend cron job)
const addPoints = async (req, res) => {
  try {
    const { points, reason } = req.body;
    const user = await User.findById(req.user._id);

    if (!points || points <= 0) {
      return res.status(400).json({ message: 'Invalid points value' });
    }

    await user.addLoyaltyPoints(points);

    res.json({
      message: `Added ${points} points for ${reason}`,
      currentPoints: user.loyaltyPoints,
      membershipTier: user.membershipTier
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding points', error: error.message });
  }
};

// Helper function to get next tier
function getNextTier(currentTier) {
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  const currentIndex = tiers.indexOf(currentTier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

// Helper function to calculate points needed for next tier
function calculatePointsToNextTier(currentPoints, currentTier) {
  const tierThresholds = {
    Bronze: 2000,
    Silver: 5000,
    Gold: 10000,
    Platinum: null
  };

  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 0;

  return tierThresholds[currentTier] - currentPoints;
}

// Get points history (if needed)
const getPointsHistory = async (req, res) => {
  try {
    // This would require a PointsHistory model to be implemented
    // For now, we'll return a placeholder
    res.json({
      message: 'Points history feature coming soon',
      currentPoints: req.user.loyaltyPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching points history', error: error.message });
  }
};

module.exports = {
  getUserPoints,
  addPoints,
  getPointsHistory
}; 