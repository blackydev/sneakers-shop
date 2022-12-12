const mongoose = require("mongoose");
const { schemas } = require("../schemas");

const maxProductAmount = 9;
const itemSchema = new mongoose.Schema(
  {
    _id: { id: false },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    price: { ...schemas.price, required: true },
    amount: {
      type: Number,
      min: 1,
      max: maxProductAmount,
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: `${Number} is not an integer value`,
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

module.exports = { itemSchema, maxProductAmount };
