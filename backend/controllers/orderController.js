import Order from "../models/orderModel.js"; // Now using ES Modules
import { getCartTotal } from "../utills/cartUtils.js";

import fetch from "node-fetch";

export const createOrder = async (req, res) => {
  const { cart, shippingDetails, deliveryOption, paymentPlan, paypalOrderID } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // if (!shippingDetails?.firstName || !shippingDetails?.lastName) {
  //   return res.status(400).json({ message: "Shipping details are incomplete" });
  // }

  if (!deliveryOption || !paymentPlan || !paypalOrderID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // ✅ Verify PayPal Payment
    const PAYPAL_CLIENT_ID = 'AdaUF7ndO3SoUvd2TwIf6PND1rbHArkozoe3eO2yr-3Humz7J8eDoeK1aOry0BOhtoE4bBDWxBySh7fl';
    const PAYPAL_SECRET = 'EGJABHNsPfhgpXUnX5iMu7D8ISbELq2g9j1L6WfxREvr-V-1ALR7rcV_4oW953RaQCrR8rkfaWZxgpPo';
    const PAYPAL_URL = "https://api-m.sandbox.paypal.com"; // Change for live mode

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_URL}/v2/checkout/orders/${paypalOrderID}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    const orderData = await response.json();

    if (orderData.status !== "COMPLETED") {
      return res.status(400).json({ message: "Payment not verified with PayPal" });
    }

    // ✅ Calculate total
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // ✅ Save the order in DB
    const newOrder = new Order({
      userId: req.user._id,
      cart,
      shippingDetails,
      deliveryOption,
      paymentPlan,
      totalAmount,
      paymentInfo: { id: paypalOrderID, status: orderData.status },
    });

    await newOrder.save();
    
    return res.status(201).json({ message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("PayPal verification error:", error);
    return res.status(500).json({ message: "Error processing payment" });
  }
};
