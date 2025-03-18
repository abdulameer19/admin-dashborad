import Order from "../models/orderModel.js"; // Now using ES Modules
import { getCartTotal } from "../utills/cartUtils.js";
import { Buffer } from "buffer";

import fetch from "node-fetch";

const PAYPAL_CLIENT_ID =
  "AdaUF7ndO3SoUvd2TwIf6PND1rbHArkozoe3eO2yr-3Humz7J8eDoeK1aOry0BOhtoE4bBDWxBySh7fl";
const PAYPAL_SECRET =
  "EGJABHNsPfhgpXUnX5iMu7D8ISbELq2g9j1L6WfxREvr-V-1ALR7rcV_4oW953RaQCrR8rkfaWZxgpPo";
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Use sandbox for testing

const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
      "base64"
    );

    console.log("Base64 Encoded Auth:", auth); // Debugging

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
      }
    );

    const data = await response.json();
    console.log("PayPal Token Response:", data);

    if (data.access_token) {
      return data.access_token;
    } else {
      console.error("Failed to get PayPal access token:", data);
      return null;
    }
  } catch (error) {
    console.error("Error generating PayPal token:", error);
    return null;
  }
};

// Create PayPal Order (Don't save in DB yet)
export const createPayPalOrder = async (req, res) => {
  const { cart, totalAmount } = req.body;
  console.log("Cart:", JSON.stringify(cart, null, 2));
  console.log("Total Amount:", totalAmount);

  try {
    // Step 1: Generate PayPal Access Token
    const accessToken = await generateAccessToken();
    console.log("Generated Access Token:", accessToken);

    if (!accessToken) {
      return res
        .status(500)
        .json({ message: "Failed to generate PayPal token." });
    }

    // Step 2: Ensure `totalAmount` is formatted as a string
    const formattedTotalAmount = parseFloat(totalAmount).toFixed(2).toString();

    // Step 3: Create PayPal Order
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              value: formattedTotalAmount,
              currency_code: "EUR",
              breakdown: {
                item_total: {
                  value: formattedTotalAmount,
                  currency_code: "EUR",
                },
              },
            },
            items: cart.map((item) => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: "EUR",
                value: parseFloat(item.price).toFixed(2).toString(),
              },
            })),
          },
        ],
        application_context: {
          return_url: "http://localhost:3000/payment-success",
          cancel_url: "https://yourwebsite.com/payment-cancelled",
        },
      }),
    });

    const data = await response.json();
    console.log("PayPal API Response:", JSON.stringify(data, null, 2)); // Debugging

    if (!data.id) {
      return res
        .status(500)
        .json({ message: "Error creating PayPal order", error: data });
    }

    res.json({ orderID: data.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ message: "Error creating PayPal order." });
  }
};

// Capture PayPal Order & Create Order in DB
export const capturePayPalOrder = async (req, res) => {
  const {
    orderID,
    cart,
    shippingDetails,
    deliveryOption,
    paymentPlan,
    insurance,
  } = req.body;

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User authentication required." });
  }

  try {
    const accessToken = await generateAccessToken();

    // Capture the payment
    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("PayPal Capture Response:", JSON.stringify(data, null, 2)); // Debugging

    if (data.status === "COMPLETED") {
      const totalAmount =
        data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ||
        "0.00";
      const transactionId = data.id;

      // Save order in database only after successful payment
      const newOrder = new Order({
        userId: req.user._id, // Associate order with authenticated user
        cart,
        shippingDetails,
        deliveryOption,
        paymentPlan,
        insurance, // Include insurance in order
        totalAmount: parseFloat(totalAmount),
        transactionId, // Save transaction ID
        status: "completed",
      });

      await newOrder.save();

      return res
        .status(201)
        .json({ message: "Order placed successfully", order: newOrder });
    }

    // Handle unsuccessful payment
    return res.status(400).json({ message: "Payment not completed", data });
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return res
      .status(500)
      .json({ message: "Server error, unable to place order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Fetch orders sorted by latest
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!["pending", "completed", "shipped", "canceled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status }, // Update status
    { new: true, runValidators: true } // Return updated order & enforce enum validation
  );

  if (!updatedOrder) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(updatedOrder);
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate(
      "cart.productId",
      "image name price"
    ); // Populating product details
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
