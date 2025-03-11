import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
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
    enum: ["Standard", "express"],
    required: true,
  },
  paymentPlan: {
    type: String,
    enum: ["Full Payment", "installments"],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  insurance: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled", "shipped"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// Use export default instead of module.exports
export default Order;
