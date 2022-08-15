const Joi = require("joi");

const companyNameSchema = {
  type: String,
  minlength: 0,
  maxlength: 255,
};

const companyNameJoiSchema = Joi.string().min(0).max(255);

exports.companyNameSchema = companyNameSchema;
exports.companyNameJoiSchema = companyNameJoiSchema;
