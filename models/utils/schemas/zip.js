const Joi = require("joi");

const zipSchema = {
  type: String,
  minlength: 3,
  maxlength: 12,
  trim: true,
};

const zipJoiSchema = Joi.string().min(3).max(12);

exports.zipSchema = zipSchema;
exports.zipJoiSchema = zipJoiSchema;
