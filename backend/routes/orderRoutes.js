const express = require("express");
const { createOrder } = require("../controllers/orderController");
const { authenticateUser } = require("../middleware/authMiddleware"); // Assuming you have auth middleware to check user authentication

const router = express.Router();

// Route to create a new order
router.post("/checkout", authenticateUser, createOrder);

module.exports = router;
