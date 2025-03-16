const express = require('express');
const {
  register,
  login,
  profile,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  setup2FA,
  verify2FA, // Import verify2FA
  resetPassword,
  forgotPassword,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth(['admin', 'moderator', 'user']), profile);
router.get('/users', auth(['admin', 'moderator']), getAllUsers);
router.put('/users/:id', auth(['admin', 'moderator']), updateUser);
router.delete('/users/:id', auth(['admin', 'moderator']), deleteUser);
router.get('/users/:id', auth(['admin', 'moderator']), getUserById);
router.get('/setup-2fa', auth(['user', 'moderator', 'admin']), setup2FA); // Protected route
router.post('/verify-2fa', auth(['user', 'moderator', 'admin']), verify2FA); // Add verify2FA route
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
