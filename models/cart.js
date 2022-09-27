const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas } = require("./utils/schemas");
const dayjs = require("dayjs");

const maxProductQuantity = 6;

const listItemSchema = new mongoose.Schema(
  {
    _id: { id: false },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    cost: { ...schemas.price, required: true },
    quantity: {
      type: Number,
      min: 1,
      max: maxProductQuantity,
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    _id: { id: false },
    list: [listItemSchema],
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const modelSchema = new mongoose.Schema(
  { list: [listItemSchema] },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    timestamps: true,
  }
);

const Cart = mongoose.model("carts", modelSchema);

function validate(cartElement) {
  const schema = Joi.object().keys({
    product: Joi.objectId().required(),
    quantity: Joi.number().integer().min(1).max(maxProductQuantity).required(),
  });

  return schema.validate(cartElement);
}

Cart.findById = function (id) {
  return this.findByIdAndUpdate(id, { updatedAt: new Date() }).select(
    "-createdAt -updatedAt"
  );
};

async function deleteCarts(carts) {
  carts.map(async (cart) => {
    for (const item of cart.list)
      await Product.findByIdAndIncreaseStock(item.product, item.quantity);
    await cart.remove();
  });
}

function deleteCartsInterval() {
  const minute = 60 * 1000;
  const hour = 60 * minute;

  setInterval(async function () {
    // deletion of unupdated carts
    const limit = dayjs().subtract(20, "minute");
    const carts = await Cart.find({ updatedAt: { $lt: limit } });
    await deleteCarts(carts);
  }, 5 * minute);

  setInterval(async function () {
    // deletion deprecated carts
    const limit = dayjs().subtract(6, "hour");
    const carts = await Cart.find({ createdAt: { $lt: limit } });
    await deleteCarts(carts);
  }, 3 * hour);
}

module.exports = {
  validate,
  cartSchema,
  Cart,
  deleteCartsInterval,
};
