import express from "express";
import { createOrder } from "../controllers/orderController.js"; // Now using ES Modules

const router = express.Router();

router.post("/", createOrder);

export default router;
