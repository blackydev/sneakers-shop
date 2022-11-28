const Joi = require("joi");

const addressSchema = {
  type: String,
  minlength: 1,
  maxlength: 255,
  lowercase: true,
};

const addressJoiSchema = Joi.string().min(1).max(255);

exports.addressSchema = addressSchema;
exports.addressJoiSchema = addressJoiSchema;
