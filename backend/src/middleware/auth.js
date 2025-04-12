const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

const checkMembershipTier = (requiredTier) => {
  return (req, res, next) => {
    const tierOrder = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const userTierIndex = tierOrder.indexOf(req.user.membershipTier);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);

    if (userTierIndex >= requiredTierIndex) {
      next();
    } else {
      res.status(403).json({ 
        message: `This feature requires ${requiredTier} membership tier or higher.` 
      });
    }
  };
};

module.exports = { auth, checkMembershipTier }; 