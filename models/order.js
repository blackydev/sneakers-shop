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

  status: {
    type: String,
    default: "pending",
    maxlength: 256,
  },
});

const Order = mongoose.model("orders", orderSchema);

function validateCart(cart) {
  const statuses = [
    "pending",
    "interrupted",
    "paid",
    "delivering",
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
exports.Order = Order;
exports.validate = validateOrder;
