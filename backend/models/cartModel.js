const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      uniqueKey: { type: String, required: true },
      product: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
      selectedOption: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        additionalCost: { type: Number, required: true },
      },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
