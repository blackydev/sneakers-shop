const Joi = require("joi");
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");
const { cartSchema } = require("./cart");
const { schemas, joiSchemas } = require("./utils/schemas");

const orderSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },

  cart: {
    type: cartSchema,
    required: true,
  },

  amount: {
    ...schemas.price,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
    maxlength: 256,
  },
});

const Order = mongoose.model("orders", orderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    customer: Joi.object().required(),
    cart: Joi.object().required(),
    amount: joiSchemas.price,
    status: Joi.string().max(256),
  });

  return schema.validate(order);
}

exports.Order = Order;
exports.validate = validateOrder;
