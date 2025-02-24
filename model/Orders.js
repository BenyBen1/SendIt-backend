const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  deliveryLocation: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Delivered"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
