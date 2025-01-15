// Utility function to calculate total cart amount
const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

module.exports = { getCartTotal };
