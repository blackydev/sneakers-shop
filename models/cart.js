const Joi = require("joi");
const mongoose = require("mongoose");
const { productSchema } = require("./product");

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: productSchema, required: true },
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
});

function validateCart(cart) {
  const schema = Joi.object({
    products: Joi.array().items({
      productId: Joi.objectId().required(),
      quantity: Joi.number().integer().min(1),
    }),
  });

  return schema.validate(cart);
}

exports.validate = validateCart;
exports.cartSchema = cartSchema;
