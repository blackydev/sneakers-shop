const { deleteCartsInterval } = require("../controllers/carts");

module.exports = function () {
  if (process.env.NODE_ENV != "test") {
    deleteCartsInterval();
  }
};
