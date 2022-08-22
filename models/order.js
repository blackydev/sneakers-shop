const Joi = require("joi");
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");
const { cartSchema } = require("./cart");

const orderSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },

  cart: {
    type: cartSchema,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
    maxlength: 256,
  },

  p24: {
    _id: {
      type: Number,
    },
  },
});

const Order = mongoose.model("orders", orderSchema);
const paymentTimeLimit = 30; /* IN MINUTES */

function validateOrder(cart) {
  const statuses = [
    "pending",
    "interrupted",
    "paid",
    "in delivery",
    "finalised",
  ];

  const schema = Joi.object({
    customer: Joi.object().required(),
    cart: Joi.object().required(),
    status: Joi.string()
      .max(256)
      .custom((v, helper) => {
        return statuses.includes(v)
          ? true
          : helper.message("Invalid order status.");
      }),
  });

  return schema.validate(cart);
}

module.exports = {
  Order,
  validate: validateOrder,
  paymentTimeLimit,
};
