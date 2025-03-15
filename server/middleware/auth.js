const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Get the token from the Authorization header
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token provided');
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Find the user by ID
      const user = await User.findById(decoded.id);
      if (!user) {
        console.error('User not found in database');
        throw new Error('User not found');
      }

      // Check if the token exists in the user's tokens array
      const tokenExists = user.tokens.some((t) => t.token === token);
      if (!tokenExists) {
        console.error('Token not found in user document');
        throw new Error('Invalid token');
      }

      // Check if the user has the required role
      if (roles.length && !roles.includes(user.role)) {
        console.error('User role not authorized');
        throw new Error('Unauthorized role');
      }

      // Attach the user and token to the request object
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      console.error('Auth middleware error:', err.message);
      res.status(401).send({ error: 'Unauthorized' });
    }
  };
};

module.exports = auth;
