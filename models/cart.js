const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas } = require("./utils/schemas");

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

Cart.findById = function (id) {
  return this.findByIdAndUpdate(id, { updatedAt: new Date() }).select(
    "-createdAt -updatedAt"
  );
};

const maxProductQuantity = 6;

function validate(cartElement) {
  const schema = Joi.object().keys({
    product: Joi.objectId().required(),
    quantity: Joi.number().integer().min(1).max(maxProductQuantity).required(),
  });

  return schema.validate(cartElement);
}

exports.validate = validate;
exports.cartSchema = cartSchema;
exports.Cart = Cart;
