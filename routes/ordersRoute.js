const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const mongoose = require("mongoose");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  next();
};

// Middleware to check admin privileges
const isAdmin = (req, res, next) => {
  if (req.session.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};


// Create a new order
router.post("/", isAuthenticated, async (req, res) => {
  try {
    // Debugging logs
    console.log("🔍 Session Data:", req.session);
    if (!req.session.user || !req.session.user._id) {
      return res.status(400).json({ error: "User ID is missing from session. Please log in." });
    }

    const newOrder = new Order({
      ...req.body,
      userId: req.session.user._id, // Assign user ID automatically
    });

    await newOrder.save();
    res.status(201).json({ message: "Order stored successfully!", order: newOrder });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


// Get all orders (Admin only)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get orders for a specific user
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get logged-in user's orders
router.get("/my-orders", isAuthenticated, async (req, res) => {
  try {
    console.log("🔍 Session Data:", req.session); // Debugging
    console.log("🔍 User ID:", req.session.user._id);

    const orders = await Order.find({ userId: req.session.user._id }); // Correct query

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


// Update an order (Only owner or admin)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Allow update only if the user is the owner or an admin
    if (order.userId.toString() !== req.session.user._id && !req.session.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Not allowed to modify this order" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Delete an order (Only owner or admin)
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Allow deletion only if the user is the owner or an admin
    if (order.userId.toString() !== req.session.user._id && !req.session.user.isAdmin) {
      return res.status(403).json({ error: "Forbidden: Not allowed to delete this order" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
