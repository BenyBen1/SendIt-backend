const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true },
    senderAddress: { type: String, required: true },
    senderContact: { type: String, required: true },

    receiverName: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    receiverContact: { type: String, required: true },

    packageDescription: { type: String, required: true },
    packageWeight: { type: Number, required: true },
    specialInstructions: { type: String },

    deliveryOption: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },

    pickupDropoff: {
      type: String,
      enum: ["pickup", "door"],
      default: "pickup",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "credit-card"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
