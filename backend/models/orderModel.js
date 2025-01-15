const mongoose = require("mongoose");

// Order schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  shippingDetails: {
    firstName: String,
    lastName: String,
    address: String,
    postalCode: String,
    city: String,
    country: String,
    phone: String,
    email: String,
    message: String,
  },
  deliveryOption: {
    type: String,
    enum: ["standard", "express"],
    required: true,
  },
  paymentPlan: {
    type: String,
    enum: ["full", "installments"],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
