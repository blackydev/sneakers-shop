const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas } = require("../utils/schemas");

const cartSchema = new mongoose.Schema({
  _id: { id: false },
  products: [
    {
      _id: { id: false },
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: {
        type: String,
        required: true,
        maxlength: 10000,
        trim: true,
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

  amount: {
    ...schemas.price,
    required: true,
  },
});

function validateCart(cart) {
  const schema = Joi.object().keys({
    products: Joi.array().items(
      Joi.object().keys({
        productId: Joi.objectId().required(),
        quantity: Joi.number().integer().min(1),
      })
    ),
  });

  return schema.validate(cart);
}

exports.validate = validateCart;
exports.cartSchema = cartSchema;
