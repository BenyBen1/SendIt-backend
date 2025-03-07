const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add this
    senderName: { type: String },
    senderAddress: { type: String },
    senderContact: { type: String },
    receiverName: { type: String },
    receiverAddress: { type: String },
    receiverContact: { type: String },
    packageDescription: { type: String },
    packageWeight: { type: Number },
    specialInstructions: { type: String },
    deliveryOption: { type: String, enum: ["standard", "express", "same-day"], default: "standard" },
    pickupDropoff: { type: String, enum: ["pickup", "door"], default: "pickup" },
    paymentMethod: { type: String, enum: ["cash", "credit-card"] },
    status: { type: String, enum: ["Pending", "In Progress", "Delivered"], default: "Pending" },
    balance: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
