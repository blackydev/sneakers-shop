const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./schemas");

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

    price: { ...schemas.price, required: true },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
    },
    release: {
      type: Date,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  },
  {
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const Product = mongoose.model("products", productSchema);

Product.findByIdAndIncreaseStock = function (id, amount) {
  return this.findByIdAndUpdate(
    id,
    {
      $inc: { numberInStock: amount },
    },
    { new: true }
  );
};

Product.findByIdAndDecreaseStock = function (id, amount) {
  return this.findByIdAndIncreaseStock(id, amount * -1);
};

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(512).required(),
    image: joiSchemas.filename.required(),
    description: Joi.string().min(32).required(),
    price: joiSchemas.price.required(),
    numberInStock: Joi.number().min(0).required(),
    release: Joi.date(),
    category: Joi.objectId().required(),
  });

  return schema.validate(product);
}

module.exports = {
  Product,
  validate: validateProduct,
  productSchema,
};
