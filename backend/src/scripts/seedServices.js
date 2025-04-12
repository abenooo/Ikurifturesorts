const mongoose = require('mongoose');
const Service = require('../models/Service');
require('dotenv').config();

const dummyServices = [
  {
    name: "Luxury Suite",
    description: "Experience ultimate luxury in our premium suite with ocean view, private balcony, and butler service.",
    category: "Accommodation",
    price: 500,
    pointsMultiplier: 2.0,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
    ],
    duration: 24,
    capacity: 2,
    requirements: ["Valid ID", "Credit Card"]
  },
  {
    name: "Couples Spa Package",
    description: "Indulge in a romantic couples spa experience with champagne and chocolate.",
    category: "Spa",
    price: 300,
    pointsMultiplier: 1.5,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef"
    ],
    duration: 120,
    capacity: 2,
    requirements: ["Reservation required 24h in advance"]
  },
  {
    name: "Sunset Dinner Cruise",
    description: "Enjoy a magical evening with fine dining and live entertainment on our luxury yacht.",
    category: "Dining",
    price: 200,
    pointsMultiplier: 1.8,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de"
    ],
    duration: 180,
    capacity: 20,
    requirements: ["Dress code: Smart casual", "Arrive 30 minutes before departure"]
  },
  {
    name: "Mountain Trekking Adventure",
    description: "Guided trekking experience through scenic mountain trails with professional guides.",
    category: "Adventure",
    price: 150,
    pointsMultiplier: 1.2,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
      "https://images.unsplash.com/photo-1551632811-561732d1e306"
    ],
    duration: 240,
    capacity: 8,
    requirements: ["Comfortable hiking shoes", "Water bottle", "Sun protection"]
  },
  {
    name: "Yoga & Meditation Retreat",
    description: "Daily yoga sessions and meditation workshops in a serene environment.",
    category: "Wellness",
    price: 180,
    pointsMultiplier: 1.3,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a"
    ],
    duration: 60,
    capacity: 15,
    requirements: ["Yoga mat", "Comfortable clothing"]
  },
  {
    name: "Beachfront Villa",
    description: "Exclusive beachfront villa with private pool and direct beach access.",
    category: "Accommodation",
    price: 800,
    pointsMultiplier: 2.5,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
    ],
    duration: 24,
    capacity: 6,
    requirements: ["Minimum 2-night stay", "Valid ID"]
  },
  {
    name: "Gourmet Cooking Class",
    description: "Learn to cook local cuisine with our expert chefs in a hands-on cooking class.",
    category: "Dining",
    price: 120,
    pointsMultiplier: 1.4,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba"
    ],
    duration: 180,
    capacity: 10,
    requirements: ["Apron provided", "Closed-toe shoes"]
  },
  {
    name: "Deep Tissue Massage",
    description: "Therapeutic deep tissue massage to relieve muscle tension and stress.",
    category: "Spa",
    price: 150,
    pointsMultiplier: 1.6,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef"
    ],
    duration: 90,
    capacity: 1,
    requirements: ["No recent injuries", "Medical clearance if needed"]
  },
  {
    name: "Water Sports Package",
    description: "Comprehensive water sports package including jet skiing, parasailing, and snorkeling.",
    category: "Adventure",
    price: 250,
    pointsMultiplier: 1.7,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9b8c1b4e",
      "https://images.unsplash.com/photo-1530866495561-507c9b8c1b4e"
    ],
    duration: 240,
    capacity: 4,
    requirements: ["Swimming ability", "Safety briefing required"]
  },
  {
    name: "Mindfulness Workshop",
    description: "Learn mindfulness techniques and meditation practices for stress reduction.",
    category: "Wellness",
    price: 100,
    pointsMultiplier: 1.1,
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773"
    ],
    duration: 120,
    capacity: 12,
    requirements: ["Comfortable seating", "Open mind"]
  }
];

const seedServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    const insertedServices = await Service.insertMany(dummyServices);
    console.log(`Successfully inserted ${insertedServices.length} services`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedServices(); 