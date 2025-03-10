import express from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js"; // Now using ES Modules

const router = express.Router();

router.get("/", getOrders);
router.put("/:id", updateOrderStatus);

router.post("/create-paypal-order", createPayPalOrder);

router.post("/capture-paypal-order", capturePayPalOrder);

export default router;
