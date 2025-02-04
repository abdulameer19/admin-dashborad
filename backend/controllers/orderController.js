import Order from "../models/orderModel.js"; // Now using ES Modules
import { getCartTotal } from "../utills/cartUtils.js";

export const createOrder = async (req, res) => {
  const { cart, shippingDetails, deliveryOption, paymentPlan } = req.body;

  // Validate required fields
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // if (
  //   !shippingDetails ||
  //   !shippingDetails.firstName ||
  //   !shippingDetails.lastName
  // ) {
  //   return res.status(400).json({ message: "Shipping details are incomplete" });
  // }

  if (!deliveryOption || !paymentPlan) {
    return res
      .status(400)
      .json({ message: "Delivery and payment options are required" });
  }

  // Transform cart to match schema
  const transformedCart = cart.map((item) => ({
    productId: item._id, // Ensure productId is mapped correctly
    quantity: item.quantity,
    price: item.price,
  }));

  // Calculate total order amount
  const totalAmount = getCartTotal(transformedCart);

  try {
    // Create new order
    const newOrder = new Order({
      userId: req.user._id, // Ensure user is authenticated
      cart: transformedCart,
      shippingDetails,
      deliveryOption,
      paymentPlan,
      totalAmount,
    });

    // Save the order
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
