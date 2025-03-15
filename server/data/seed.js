const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.log(err));

// Destroy existing data
const destroyData = async () => {
  try {
    await User.deleteMany({});
    console.log('Database destroyed successfully.');
  } catch (err) {
    console.error('Error destroying database:', err);
  }
};

// Generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

// Seed initial data
const seedData = async () => {
  try {
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10), // Hash the password
        role: 'admin',
      },
      {
        username: 'moderator',
        email: 'moderator@example.com',
        password: await bcrypt.hash('moderator123', 10), // Hash the password
        role: 'moderator',
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10), // Hash the password
        role: 'user',
      },
    ];

    // Insert users and generate tokens
    for (const userData of users) {
      const user = new User(userData);
      const token = generateToken(user._id);
      user.tokens = [{ token }]; // Store the token in the user document
      await user.save();
      console.log(`User created: ${user.username} with token: ${token}`);
    }

    console.log('Data seeded successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

// Run the script
const runScript = async () => {
  await destroyData(); // Destroy existing data
  await seedData(); // Seed new data
  mongoose.connection.close(); // Close the connection
};

runScript();
