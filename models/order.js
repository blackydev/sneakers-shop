const Joi = require("joi");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const { schemas } = require("./schemas");
const { customerSchema, joiSchema: customerJoiSchema } = require("./customer");
const { itemItemsSchema } = require("./cart");
const { Product } = require("./product");

const statuses = ["pending", "interrupted", "paid", "accepted", "shipped"];

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: customerSchema,
      required: true,
    },

    cart: [
      {
        type: itemItemsSchema,
        required: true,
      },
    ],

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

      price: {
        ...schemas.price,
        required: true,
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

orderSchema.methods.getTotalPrice = function () {
  let totalPrice = this.delivery.price;
  for (const item of this.cart) totalPrice += item.price * item.amount;

  return totalPrice;
};

const Order = mongoose.model("orders", orderSchema);

function validate(order) {
  const schema = Joi.object({
    customer: customerJoiSchema.required(),
    cartId: Joi.objectId().required(),
    status: Joi.string().max(256),

    deliveryId: Joi.objectId().required(),
  });

  return schema.validate(order);
}

async function deleteOrdersInterval() {
  const minute = 1000 * 60;
  const hour = 60 * minute;

  setInterval(async function () {
    // deletion deprecated orders
    const limit = dayjs().subtract(3, "hour");
    const orders = await Order.find({ createdAt: { $lt: limit } });
    orders.map(async (order) => {
      for (const item of order.cart)
        await Product.findByIdAndIncreaseStock(item.product, item.amount);
      order.status = "interrupted";
      await order.save();
    });
  }, 3 * hour);
}

module.exports = {
  Order,
  validate,
  statuses,
  deleteOrdersInterval,
};
