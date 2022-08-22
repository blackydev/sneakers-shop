const { Order, paymentTimeLimit } = require("../models/order");
const { returnCart } = require("../controllers/carts");

const setInterruptedOrders = async () => {
  let orders = await Order.find({ status: "pending" });
  const currentTime = new Date.UTC();
  for (const order of orders) {
    const orderTime = order._id.getTimestamp();
    const result = (currentTime - orderTime) / 1000 / 60;
    if (result > 500)
      await Order.findByIdAndUpdate(order._id, { status: "interrupted" });
    await returnCart(Order.cart);
  }
  console.log("XDDD");
};

module.exports = {
  setInterruptedOrders,
};
