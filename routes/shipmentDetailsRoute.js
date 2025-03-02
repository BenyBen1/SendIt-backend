const express = require("express");
const Shipment = require("../model/ShipmentDetails");

const router = express.Router();

// Create a new shipment
router.post("/", async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all shipments
router.get("/", async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific shipment by ID
router.get("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a shipment by ID
router.put("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a shipment by ID
router.delete("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
