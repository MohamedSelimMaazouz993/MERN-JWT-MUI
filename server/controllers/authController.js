const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');

// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail',
    pass: 'password',
  },
});

// Register a new user
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

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    // If 2FA is enabled, generate and validate the token automatically
    if (user.secret) {
      // Generate a TOTP token
      const token = speakeasy.totp({
        secret: user.secret,
        encoding: 'base32',
      });

      // Debugging: Log the generated token
      console.log('Generated Token:', token);

      // Verify the 2FA token
      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token,
        window: 1, // Allow a 1-step window for time drift
      });

      console.log('Token Verified:', verified);

      if (!verified) {
        throw new Error('Invalid 2FA token');
      }
    }

    // Generate a JWT token
    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Save the token to the user's tokens array
    user.tokens.push({ token: authToken });
    await user.save();

    res.send({ user, token: authToken });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(400).send({ error: err.message });
  }
};

// Fetch user profile
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

// Get all users
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

// Update a user
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

// Delete a user
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

// Get user by ID
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

// Setup 2FA for a user
const setup2FA = async (req, res) => {
  try {
    const user = req.user;

    // Generate a 2FA secret
    const secret = speakeasy.generateSecret({ length: 20 });
    user.secret = secret.base32;
    await user.save();

    // Generate a QR code URL for Google Authenticator
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii, // Use the ASCII representation of the secret
      label: `JWT app test:${user.email}`, // Label for the authenticator app
      issuer: 'JWT app test', // Issuer name
    });

    // Send the QR code and secret to the client
    res.send({
      secret: secret.base32,
      qrCode: otpauthUrl, // Send the OTP Auth URL
    });
  } catch (err) {
    console.error('Error setting up 2FA:', err.message);
    res.status(500).send({ error: 'Failed to setup 2FA' });
  }
};

// Verify 2FA token
const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    // Verify the 2FA token
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new Error('Invalid 2FA token');
    }

    // Mark 2FA as verified (optional)
    user.is2FAVerified = true;
    await user.save();

    res.send({ message: '2FA verified successfully' });
  } catch (err) {
    console.error('Error verifying 2FA:', err.message);
    res.status(400).send({ error: 'Invalid 2FA token' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Request body:', req.body); // Log the request body
    console.log('Email:', email); // Log the email

    if (!email) {
      throw new Error('Email is required');
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Save the reset token to the user document
    user.resetToken = resetToken;
    await user.save();

    // Log email credentials for debugging
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Password:', process.env.EMAIL_PASSWORD);

    // Send the reset link via email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'youremail',
      to: user.email,
      subject: 'Password Reset',
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.send({ message: 'Password reset link sent' });
  } catch (err) {
    console.error('Error in forgot password:', err.message);
    res.status(400).send({ error: err.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and reset token
    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
    });
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    // Update the password and clear the reset token
    user.password = newPassword;
    user.resetToken = null;
    await user.save();

    res.send({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(400).send({ error: err.message });
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
  setup2FA,
  verify2FA,
  forgotPassword,
  resetPassword,
};
