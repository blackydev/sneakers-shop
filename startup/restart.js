const { setInterruptedOrders } = require("../controllers/orders");
module.exports = function () {
  setInterval(async () => {
    await setInterruptedOrders();
  }, 60 * 60 * 1000);
};
