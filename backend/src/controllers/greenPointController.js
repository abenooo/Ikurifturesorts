const GreenPoint = require('../models/GreenPoint');
const User = require('../models/User');

// Get user's total green points
const getUserGreenPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const greenPoints = await GreenPoint.find({ 
      user: user._id
    });

    const totalPoints = greenPoints.reduce((sum, point) => sum + point.points, 0);

    res.json({
      totalPoints,
      actions: greenPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching green points', error: error.message });
  }
};

// Submit a green action
const submitGreenAction = async (req, res) => {
  try {
    const { action, description } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Define points for each action
    const actionPoints = {
      towels: 50,
      housekeeping: 100,
      solar: 75,
      local: 60
    };

    const points = actionPoints[action];
    if (!points) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const greenPoint = new GreenPoint({
      user: user._id,
      action,
      points,
      description
    });

    await greenPoint.save();

    res.status(201).json({
      message: 'Green action submitted successfully',
      greenPoint
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting green action', error: error.message });
  }
};

// Get available green actions
const getGreenActions = async (req, res) => {
  try {
    const actions = [
      {
        id: "towels",
        title: "Reuse Towels",
        points: 50,
        description: "Hang your towels to reuse them during your stay"
      },
      {
        id: "housekeeping",
        title: "Skip Housekeeping",
        points: 100,
        description: "Opt out of daily housekeeping service"
      },
      {
        id: "solar",
        title: "Solar-Powered Boat Tour",
        points: 75,
        description: "Choose our eco-friendly solar boat tour option"
      },
      {
        id: "local",
        title: "Local Food Options",
        points: 60,
        description: "Choose meals prepared with locally-sourced ingredients"
      }
    ];

    res.json(actions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching green actions', error: error.message });
  }
};

module.exports = {
  getUserGreenPoints,
  submitGreenAction,
  getGreenActions
}; 