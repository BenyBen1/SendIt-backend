const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

/**
 * Middleware to check if the user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }
  next();
};

/**
 * Middleware to check if the user is an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required." });
  }
  next();
};

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Authenticate user and start a session
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store user in session
    req.session.user = { _id: user._id.toString(), email: user.email, role: user.role };

    // Ensure session is saved before responding
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session save error:", err);
        return res.status(500).json({ error: "Session could not be saved." });
      }
      res.status(200).json({ message: "Login successful", user: req.session.user });
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route   GET /auth/session
 * @desc    Check if a user is logged in
 * @access  Public
 */
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

/**
 * @route   POST /auth/logout
 * @desc    Log out the user and destroy the session
 * @access  Private
 */
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

/**
 * @route   DELETE /auth/delete
 * @desc    Delete the authenticated user's account
 * @access  Private (User)
 */
router.delete("/delete", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    // Destroy session after deletion
    req.session.destroy();

    res.status(200).json({ message: "Your account has been deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route   DELETE /auth/admin-delete/:userId
 * @desc    Admin deletes any user
 * @access  Private (Admin)
 */
router.delete("/admin-delete/:userId", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Convert both IDs to strings for comparison
    if (userId.toString() === req.session.user._id.toString()) {
      return res.status(400).json({ error: "Admins cannot delete their own account!" });
    }

    // Find and delete user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully by admin." });
  } catch (error) {
    console.error("❌ Admin Delete Error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

/**
 * @route   GET /auth/users
 * @desc    Retrieve a list of all users (Admin only)
 * @access  Private (Admin)
 */
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Fetch Users Error:", error);
    res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
