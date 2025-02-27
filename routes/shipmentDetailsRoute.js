const express = require("express");
const Shipment = require("../model/ShipmentDetails.js");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const shipment = new Shipment(req.body);
    await shipment.save();
    res.status(201).json({ message: "Shipment created successfully", shipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json({ message: "Shipment updated", shipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });
    res.json({ message: "Shipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
