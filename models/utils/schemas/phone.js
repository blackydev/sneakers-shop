const Joi = require("joi");

const phoneSchema = {
  type: String,
  minlength: 5,
  maxlength: 16,
  set: (num) => num.replaceAll(/([-+() ])/g, ""),
};

const phoneJoiSchema = Joi.string().min(5).max(16);

exports.phoneSchema = phoneSchema;
exports.phoneJoiSchema = phoneJoiSchema;
