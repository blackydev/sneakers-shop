const { Order, paymentTimeLimit } = require("../models/order");
const { getTransactionData } = require("./przelewy24.pl/main");
const { returnCart } = require("../controllers/carts");
const { result } = require("lodash");

const setInterruptedOrders = async () => {
  let orders = await Order.find({ status: "pending" });

  for (let order of orders) {
    result = await getTransactionData(order._id);
    if (result.date > paymentTimeLimit && !result.status) {
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
