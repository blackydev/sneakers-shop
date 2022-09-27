const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");
const { customerSchema, joiSchema: customerJoiSchema } = require("./customer");
const { cartSchema } = require("./cart");

const statuses = ["pending", "interrupted", "paid", "accepted", "shipped"];

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: customerSchema,
      required: true,
    },

    cart: {
      type: cartSchema,
      required: true,
    },

    p24Id: {
      type: Number,
    },

    status: {
      type: String,
      enum: statuses,
      default: "pending",
      maxlength: 256,
    },

    delivery: {
      method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deliveries",
        required: true,
      },

      cost: {
        ...schemas.price,
        required: true,
      },

      point: {
        type: String,
      },

      packageId: {
        type: Number,
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

orderSchema.methods.getTotalCost = function () {
  let totalCost = this.delivery.cost;
  for (const item of this.cart.list) {
    totalCost += item.cost * item.quantity;
  }
  return totalCost;
};

const Order = mongoose.model("orders", orderSchema);
const paymentTimeLimit = 30; /* IN MINUTES */

function validate(order) {
  const schema = Joi.object({
    customer: customerJoiSchema.required(),
    cart: Joi.objectId().required(),
    status: Joi.string()
      .max(256)
      .custom((v, helper) => {
        return statuses.includes(v)
          ? true
          : helper.message("Invalid order status.");
      })
      .required(),

    delivery: Joi.object({
      method: Joi.objectId().required(),
      point: Joi.string(),
    }),
  });

  return schema.validate(order);
}

module.exports = {
  Order,
  validate,
  paymentTimeLimit,
  statuses,
};
