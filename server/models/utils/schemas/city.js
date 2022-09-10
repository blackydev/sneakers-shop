const Joi = require("joi");

const citySchema = {
  type: String,
  minlength: 1,
  maxlength: 60,
};

const cityJoiSchema = Joi.string().min(1).max(60);

exports.citySchema = citySchema;
exports.cityJoiSchema = cityJoiSchema;
