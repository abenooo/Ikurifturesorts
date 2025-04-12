const mongoose = require('mongoose');
const Reward = require('../models/Reward');
require('dotenv').config();

const rewards = [
  // Spa Rewards
  {
    name: "Relaxing Massage Treatment",
    description: "60-minute massage with essential oils and lake view",
    pointsCost: 3500,
    category: "Spa",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Couples Spa Package",
    description: "Full spa day for two with treatments and private relaxation area",
    pointsCost: 6000,
    category: "Spa",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Traditional Ethiopian Spa Ritual",
    description: "Experience ancient wellness practices with local ingredients",
    pointsCost: 4200,
    category: "Spa",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },

  // Dining Rewards
  {
    name: "Romantic Lakeside Dinner",
    description: "Private dinner for two with a curated menu by our executive chef",
    pointsCost: 3800,
    category: "Dining",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Ethiopian Coffee Ceremony",
    description: "Traditional coffee experience with local pastries",
    pointsCost: 3000,
    category: "Dining",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    name: "Chef's Table Experience",
    description: "Interactive dining experience with our chef preparing a multi-course meal right before your eyes",
    pointsCost: 4500,
    category: "Dining",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },

  // Activities Rewards
  {
    name: "Sunset Kayaking",
    description: "Guided kayak tour on Lake Koriftu during sunset",
    pointsCost: 3200,
    category: "Activity",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    name: "Guided Birding Tour",
    description: "Explore the rich birdlife around Bishoftu with an expert guide",
    pointsCost: 3100,
    category: "Activity",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
  {
    name: "Cultural Village Tour",
    description: "Visit local villages and learn about Ethiopian traditions",
    pointsCost: 3300,
    category: "Activity",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },

  // Stays Rewards
  {
    name: "Free Night Stay",
    description: "One complimentary night in a standard room",
    pointsCost: 8000,
    category: "Room Upgrade",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Room Upgrade",
    description: "Upgrade to a premium lake view room during your stay",
    pointsCost: 5000,
    category: "Room Upgrade",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  {
    name: "Late Checkout",
    description: "Extend your stay with a 4pm checkout time",
    pointsCost: 3000,
    category: "Room Upgrade",
    validityPeriod: 90,
    isActive: true,
    quantity: -1,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  }
];

async function createRewards() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing rewards
    await Reward.deleteMany({});
    console.log('Cleared existing rewards');

    // Create new rewards
    const createdRewards = await Reward.insertMany(rewards);
    console.log(`Created ${createdRewards.length} rewards`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating rewards:', error);
    process.exit(1);
  }
}

createRewards(); 