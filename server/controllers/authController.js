const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  console.log('Register function called');
  try {
    const { username, email, password, role } = req.body;
    console.log('Request body:', { username, email, password, role });

    // Create a new user
    const user = new User({ username, email, password, role });
    console.log('User created:', user);

    // Save the user to the database
    await user.save();
    console.log('User saved to the database');

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('JWT token generated:', token);

    // Save the token to the user's tokens array
    user.tokens.push({ token });
    await user.save();

    // Send the response
    res.status(201).send({ user, token });
    console.log('Response sent:', { user, token });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(400).send({ error: err.message });
  }
};

const login = async (req, res) => {
  console.log('Login function called');
  try {
    const { email, password } = req.body;
    console.log('Request body:', { email, password });

    // Find the user by email
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      console.error('User not found');
      throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.error('Password does not match');
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Token generated:', token);

    // Save the token to the user's tokens array
    user.tokens.push({ token });
    await user.save();

    // Send the response
    res.send({ user, token });
    console.log('Response sent:', { user, token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(400).send({ error: err.message });
  }
};

const profile = async (req, res) => {
  console.log('Profile function called');
  try {
    console.log('Request user:', req.user); 
    if (!req.user) {
      throw new Error('User not found in request');
    }

    const user = await User.findById(req.user._id).select('-password');
    console.log('User profile fetched:', user);
    res.send(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).send({ error: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  console.log('Get all users function called');
  try {
    const users = await User.find().select('-password');
    console.log('Users fetched:', users);
    res.send(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send({ error: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  console.log('Update user function called');
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { username, email, role },
      { new: true }
    ).select('-password');
    console.log('User updated:', user);
    res.send(user);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send({ error: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  console.log('Delete user function called');
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    console.log('User deleted:', id);
    res.send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send({ error: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  console.log('Get user by ID function called');
  try {
    const { id } = req.params;
    console.log('User ID:', id);

    // Find the user by ID and exclude the password field
    const user = await User.findById(id).select('-password');
    if (!user) {
      console.error('User not found');
      return res.status(404).send({ error: 'User not found' });
    }

    console.log('User fetched:', user);
    res.send(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).send({ error: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  profile,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
};
