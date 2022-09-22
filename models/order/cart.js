const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas } = require("../utils/schemas");

const cartSchema = new mongoose.Schema({
  list: [
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
  ],
  totalCost: { ...schemas.price },
});

const Cart = mongoose.model("carts", cartSchema);

function validateCart(cart) {
  const schema = Joi.object().keys({
    list: Joi.array().items(
      Joi.object().keys({
        productId: Joi.objectId().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    ),
  });

  return schema.validate(cart);
}

function validateProductsList(list) {
  const schema = Joi.array().items(
    Joi.object().keys({
      productId: Joi.objectId().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  );

  return schema.validate(list);
}

exports.validate = validateCart;
exports.validateProducts = validateProductsList;
exports.cartSchema = cartSchema;
exports.Cart = Cart;
