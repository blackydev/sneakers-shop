const { Cart } = require("../models/cart");
const dayjs = require("dayjs");

exports.deleteCartInterval = () => {
  const minute = 60 * 1000;
  setInterval(function () {
    const limit = dayjs().subtract(20, "minute");
    Cart.deleteMany({ updatedAt: { $lt: limit } });
  }, 5 * minute);

  setInterval(function () {
    const limit = dayjs().subtract(1, "hour");
    Cart.deleteMany({ createdAt: { $lt: limit } });
  }, 30 * minute);
};

exports.useCart = async (id) => {
  return Cart.findByIdAndRemove(id).select("-_id -createdAt -updatedAt -__v");
};
