const { Cart } = require("../models/cart");
const dayjs = require("dayjs");
const { Product } = require("../models/product");

exports.deleteCartsInterval = () => {
  const minute = 60 * 1000;
  const hour = 60 * minute;

  // deletion of unused carts
  setInterval(async function () {
    const limit = dayjs().subtract(20, "minute");
    const carts = await Cart.find({ updatedAt: { $lt: limit } });
    await deleteCarts(carts);
  }, 5 * minute);

  // deletion deprecated carts
  setInterval(async function () {
    const limit = dayjs().subtract(3, "hour");
    const carts = await Cart.find({ createdAt: { $lt: limit } });
    await deleteCarts(carts);
  }, 3 * hour);
};

async function deleteCarts(carts) {
  carts.map(async (cart) => {
    for (const item of cart.list)
      await Product.findByIdAndIncreaseStock(item.product, item.quantity);
    await cart.remove();
  });
}
