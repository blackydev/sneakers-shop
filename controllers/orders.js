const { Order } = require("../models/order");
const { getTransactionData } = require("./payment/p24");
const { returnCart } = require("../controllers/carts");
const winston = require("winston");

const setInterruptedOrder = async (orderId) => {
  let order = await Order.findById(orderId);
  if (order.status !== "pending") return order.status;

  const res = await getTransactionData(order._id);
  if (!res.status)
    await returnCart(order.cart);
  await Order.findByIdAndUpdate(order._id, {
    status: "interrupted",
  });
  winston.info(result.date);

  return "interrupted";
};

module.exports = {
  setInterruptedOrder: setInterruptedOrder,
};
