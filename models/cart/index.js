const Joi = require("joi");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const { Product } = require("../product");
const { itemSchema, maxProductAmount } = require("./itemSchema");

const cartSchema = new mongoose.Schema(
  { items: [itemSchema] },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    timestamps: true,
  }
);

const Cart = mongoose.model("carts", cartSchema);

function validate(cartElement) {
  const schema = Joi.object().keys({
    productId: Joi.objectId().required(),
    amount: Joi.number().integer().min(1).max(maxProductAmount).required(),
  });

  return schema.validate(cartElement);
}

Cart.findById = function (id) {
  return this.findByIdAndUpdate(id, { updatedAt: new Date() }).select(
    "-createdAt -updatedAt"
  );
};

async function deleteCart(cart) {
  for (const item of cart.items)
    await Product.findByIdAndIncreaseStock(item.product, item.amount);
  await cart.remove();
}

async function deleteCartsInterval() {
  const minute = 60 * 1000;
  const hour = 60 * minute;

  const deleteCarts = async (carts) =>
    carts.map(async (cart) => await deleteCart(cart));

  setInterval(async function () {
    // deletion of unupdated carts
    const limit = dayjs().subtract(20, "minute");
    const carts = await Cart.find({ updatedAt: { $lt: limit } });
    await deleteCarts(carts);
  }, 5 * minute);

  setInterval(async function () {
    // deletion deprecated carts
    const limit = dayjs().subtract(3, "hour");
    const carts = await Cart.find({ createdAt: { $lt: limit } });
    await deleteCarts(carts);
  }, 3 * hour);
}

module.exports = {
  validate,
  itemSchema,
  Cart,
  deleteCart,
  deleteCartsInterval,
};
