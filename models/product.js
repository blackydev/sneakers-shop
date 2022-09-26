const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 512,
      trim: true,
    },
    image: {
      ...schemas.filename,
      get: (filename) => {
        return `/public/images/products/${filename}`;
      },
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
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const Product = mongoose.model("products", productSchema);

Product.findByIdAndIncreaseStock = function (id, quantity) {
  return this.findByIdAndUpdate(
    id,
    {
      $inc: { numberInStock: quantity },
    },
    { new: true }
  );
};

Product.findByIdAndDecreaseStock = function (id, quantity, decreaseHidden) {
  if (decreaseHidden) return this.findByIdAndIncreaseStock(id, quantity * -1);
  else
    return this.findOneAndUpdate(
      { _id: id, hidden: { $in: [false, null] } },
      {
        $inc: { numberInStock: -1 * quantity },
      },
      { new: true }
    );
};

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(512).required(),
    image: joiSchemas.filename.required(),
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
