const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const defaultUser = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@ikurifturesorts.com',
    password: 'admin123',
    role: 'admin'
};

async function createDefaultUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: defaultUser.email });
        if (existingUser) {
            console.log('Default user already exists');
            process.exit(0);
        }

        // Create new user
        const user = new User(defaultUser);
        await user.save();
        console.log('Default user created successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error creating default user:', error);
        process.exit(1);
    }
}

createDefaultUser(); 