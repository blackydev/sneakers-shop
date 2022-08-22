const { Order, paymentTimeLimit } = require("../models/order");
const { returnCart } = require("../controllers/carts");

const setInterruptedOrders = async () => {
  let orders = await Order.find({ status: "pending" });
  const currentTime = new Date().getTime();
  for (let order of orders) {
    const orderTime = order._id.getTimestamp();
    const result = (currentTime - orderTime) / 1000 / 60; // in minutes
    if (result > 12 * 60) {
      order = await Order.findByIdAndUpdate(order._id, {
        status: "interrupted",
      });
      await returnCart(order.cart);
    }
  }
};

module.exports = {
  setInterruptedOrders,
};
