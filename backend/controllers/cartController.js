import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    await cart.save();
  } else {
    const newCart = new Cart({
      user: req.user._id,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
      totalPrice: quantity * product.price,
    });
    await newCart.save();
  }

  res.status(201).json(cart || newCart);
};
