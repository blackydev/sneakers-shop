const Joi = require("joi");

const emailSchema = {
  type: String,
  minlength: 5,
  maxlength: 255,
  match: [
    /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    "Please fill a valid email address",
  ],
};

const emailJoiSchema = Joi.string()
  .min(5)
  .max(255)
  .pattern(
    /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  );

exports.emailSchema = emailSchema;
exports.emailJoiSchema = emailJoiSchema;
