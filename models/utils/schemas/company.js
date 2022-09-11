const Joi = require("joi");

const companySchema = {
  type: String,
  minlength: 0,
  maxlength: 255,
};

const companyJoiSchema = Joi.string().min(0).max(255);

module.exports = {
  companySchema,
  companyJoiSchema,
};
