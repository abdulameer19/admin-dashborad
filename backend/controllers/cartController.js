const Cart = require("../models/Cart"); // Assuming you have a Cart model
const asyncHandler = require("express-async-handler");

// Add to Cart
const addToCart = asyncHandler(async (req, res) => {
  const { userId, product, selectedOption } = req.body;

  if (!userId || !product || !selectedOption) {
    return res
      .status(400)
      .json({ message: "User ID, product, and selected option are required." });
  }

  const uniqueKey = `${product._id}-${selectedOption._id}`;

  // Fetch the cart for the user
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // Create a new cart if it doesn't exist
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.uniqueKey === uniqueKey
  );

  if (existingItemIndex !== -1) {
    // If item exists, increment its quantity
    cart.items[existingItemIndex].quantity += 1;
  } else {
    // If item doesn't exist, add it
    cart.items.push({
      uniqueKey,
      product,
      selectedOption,
      quantity: 1,
      price: product.price + selectedOption.additionalCost,
    });
  }

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    message: "Item added to cart successfully",
    cart: cart.items,
  });
});

// Get Cart
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found for the user." });
  }

  res.status(200).json({
    message: "Cart fetched successfully",
    cart: cart.items,
  });
});

module.exports = { addToCart, getCart };
