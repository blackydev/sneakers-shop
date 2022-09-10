const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 512,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    maxlength: 2560,
  },
  description: {
    type: String,
    required: true,
    minlength: 32,
  },
  slogan: {
    type: String,
    minlength: 0,
    maxlength: 256,
  },
  price: { ...schemas.price, required: true },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  release: {
    type: Date,
  },
  hidden: {
    type: Boolean,
  },
});

const Product = mongoose.model("products", productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(512).required(),
    image: Joi.string().max(2560).required(),
    description: Joi.string().min(32).required(),
    slogan: Joi.string().max(256),
    price: joiSchemas.price.required(),
    numberInStock: Joi.number().min(0).required(),
    release: Joi.date(),
    hidden: Joi.boolean(),
  });

  return schema.validate(product);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.productSchema = productSchema;
