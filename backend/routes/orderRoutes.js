import express from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/orderController.js"; // Now using ES Modules

const router = express.Router();

router.post("/create-paypal-order", createPayPalOrder);
router.post("/capture-paypal-order", capturePayPalOrder);

export default router;
