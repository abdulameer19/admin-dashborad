import express from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
  getOrders,
  updateOrderStatus,
  getOrderById,
} from "../controllers/orderController.js"; // Now using ES Modules

const router = express.Router();

router.get("/", getOrders);
router.put("/:id", updateOrderStatus);
router.get("/:id", getOrderById);

router.post("/create-paypal-order", createPayPalOrder);

router.post("/capture-paypal-order", capturePayPalOrder);

export default router;
