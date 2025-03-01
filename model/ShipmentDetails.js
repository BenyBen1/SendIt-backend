const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  packageDescription: { type: String, required: true },
  sender: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true }
  },
  receiver: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true }
  },
  deliveryOption: { type: String, enum: ["Standard", "Express"], required: true },
  packageWeight: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  specialInstructions: { type: String, default: "None" },
  status: { type: String, enum: ["Pending", "In transit", "Delivered"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;
