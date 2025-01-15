const Order = require("../models/orderModel"); // import order model
const { getCartTotal } = require("../utills/cartUtils"); // utility to calculate total

// Create a new order
const createOrder = async (req, res) => {
  const { cart, shippingDetails, deliveryOption, paymentPlan } = req.body;

  // Validate required fields
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  if (
    !shippingDetails ||
    !shippingDetails.firstName ||
    !shippingDetails.lastName
  ) {
    return res.status(400).json({ message: "Shipping details are incomplete" });
  }

  if (!deliveryOption || !paymentPlan) {
    return res
      .status(400)
      .json({ message: "Delivery and payment options are required" });
  }

  // Calculate total order amount
  const totalAmount = getCartTotal(cart); // utility function to calculate the total

  try {
    // Create new order
    const newOrder = new Order({
      userId: req.user._id, // Assuming the user is authenticated
      cart,
      shippingDetails,
      deliveryOption,
      paymentPlan,
      totalAmount,
    });

    // Save the order to the database
    await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, unable to place order" });
  }
};

module.exports = { createOrder };
