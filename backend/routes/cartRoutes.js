const express = require("express");
const { addToCart, getCart } = require("../controllers/cartController");

const router = express.Router();

// Route to add item to cart
router.post("/add", addToCart);

// Route to get cart
router.get("/", getCart);

module.exports = router;
