const express = require('express');
const router = express.Router();
const User = require('../models/user');
const session = require('express-session');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

// GET /users - Fetch all users (Admin only)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    const users = await User.find({}, '-password'); // Exclude password field
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/me - Fetch logged-in user's details
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id, '-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
