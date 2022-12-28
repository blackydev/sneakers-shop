const { deleteOrdersInterval } = require("../models/order");
const { deleteCartsInterval } = require("../models/cart");

module.exports = function () {
  if (process.env.NODE_ENV !== "test") {
    deleteCartsInterval();
    deleteOrdersInterval();
  }
};
