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

    // Step 3: Create PayPal Order with Required `breakdown`
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
                }, // 🔥 REQUIRED FIELD
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

    if (data.status === "COMPLETED") {
      // Save order in database only after payment success
      const newOrder = new Order({
        userId: req.user._id,
        cart,
        shippingDetails,
        deliveryOption,
        paymentPlan,
        insurance, // Include insurance in order
        totalAmount: data.purchase_units[0].payments.captures[0].amount.value,
        transactionId: data.id, // Save transaction ID
      });

      // Save the order
      await newOrder.save();

      return res
        .status(201)
        .json({ message: "Order placed successfully", order: newOrder });
    }

    // Handle unsuccessful payment
    return res.status(400).json({ message: "Payment not completed", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, unable to place order" });
  }
};
