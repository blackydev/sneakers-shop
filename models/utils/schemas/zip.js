const Joi = require("joi");

const zipSchema = {
  type: String,
  minlength: 3,
  maxlength: 256,
  trim: true,
};

const zipJoiSchema = Joi.string()
  .min(1)
  .max(32)
  .pattern(/^[0-9]{2}-[0-9]{3}/)

exports.zipSchema = zipSchema;
exports.zipJoiSchema = zipJoiSchema;
