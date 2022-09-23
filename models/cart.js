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
    list: [listItemSchema],
    totalCost: { ...schemas.price },
  },
  {
    toObject: { setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
    timestamps: true,
  }
);

const Cart = mongoose.model("carts", cartSchema);
const maxProductQuantity = 6;

function validateCart(cart) {
  const schema = Joi.object().keys({
    list: Joi.array().items(
      Joi.object().keys({
        product: Joi.objectId().required(),
        quantity: Joi.number()
          .integer()
          .min(1)
          .max(maxProductQuantity)
          .required(),
      })
    ),
  });

  return schema.validate(cart);
}

function validateListItem(product) {
  const schema = Joi.object().keys({
    product: Joi.objectId().required(),
    quantity: Joi.number().integer().min(1).max(maxProductQuantity).required(),
  });

  return schema.validate(product);
}

exports.validate = validateCart;
exports.validateListItem = validateListItem;
exports.cartSchema = cartSchema;
exports.Cart = Cart;
