const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ error: "Email is already registered!" });
    }

    res.status(500).json({ error: "Server error!" });
  }
});


// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.user = { id: user._id, email: user.email, role: user.role };
    
    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//GET /auth/session (Check if user is logged in)
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// GET /auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

// DELETE /auth/delete
router.delete("/delete", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Delete user
    await User.deleteOne({ email });

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
