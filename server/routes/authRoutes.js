const express = require('express');
const {
  register,
  login,
  profile,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile',auth(['admin', 'moderator','user']), profile); 
router.get('/users', auth(['admin', 'moderator']), getAllUsers);
router.put('/users/:id', auth(['admin', 'moderator']), updateUser);
router.delete('/users/:id', auth(['admin', 'moderator']), deleteUser);
router.get('/users/:id', auth(['admin', 'moderator']), getUserById);

module.exports = router;
