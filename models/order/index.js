const Joi = require("joi");
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");
const { cartSchema } = require("./cart");
const { schemas, joiSchemas } = require("../utils/schemas");

const statuses = ["pending", "interrupted", "paid", "accepted", "shipped"];

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
    enum: statuses,
    default: "pending",
    maxlength: 256,
  },

  p24Id: {
    type: Number,
  },

  totalCost: {
    ...schemas.price,
    required: true /* total amount = cart cost + delivery cost */,
  },

  delivery: {
    methodId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    cost: {
      ...schemas.price,
      required: true,
    },
    point: {
      type: String,
    },
  },
});

const Order = mongoose.model("orders", orderSchema);
const paymentTimeLimit = 30; /* IN MINUTES */

function validateOrder(order) {
  const schema = Joi.object({
    customer: Joi.object().required(),
    cart: Joi.object().required(),
    status: Joi.string()
      .max(256)
      .custom((v, helper) => {
        return statuses.includes(v)
          ? true
          : helper.message("Invalid order status.");
      })
      .required(),

    delivery: Joi.object().required(),
  });

  return schema.validate(order);
}

module.exports = {
  Order,
  validate: validateOrder,
  paymentTimeLimit,
  statuses,
};
