const Joi = require("joi");

const emailSchema = {
  type: String,
  minlength: 5,
  maxlength: 255,
};

const emailJoiSchema = Joi.string().min(5).max(255).email();

exports.emailSchema = emailSchema;
exports.emailJoiSchema = emailJoiSchema;
