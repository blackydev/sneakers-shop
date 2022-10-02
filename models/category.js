const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 192,
    required: true,
  },
});

const Category = mongoose.model("categories", categorySchema);

function validate(category) {
  const schema = Joi.object({
    name: Joi.string().max(192).required(),
  });

  return schema.validate(category);
}

exports.categorySchema = categorySchema;
exports.validate = validate;
exports.Category = Category;
