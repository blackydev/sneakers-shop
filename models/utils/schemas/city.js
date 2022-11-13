const Joi = require("joi");

const citySchema = {
  type: String,
  minlength: 1,
  maxlength: 28,
};

const cityJoiSchema = Joi.string().min(1).max(28);

exports.citySchema = citySchema;
exports.cityJoiSchema = cityJoiSchema;
