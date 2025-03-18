import express from "express";
import { protect } from "../middleware/authMiddleware.js";
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

router.post("/create-paypal-order", protect, createPayPalOrder);
router.post("/capture-paypal-order", protect, capturePayPalOrder);
export default router;
