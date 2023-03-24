const Joi = require("joi");

const emailSchema = {
  type: String,
  minlength: 5,
  maxlength: 255,
};

const emailJoiSchema = Joi.string().min(5).max(255).email();

const priceSchema = {
  type: Number,
  min: 0,
  get: (num) => num / 100,
  set: (num) => Math.round(num * 100),
};

const priceJoiSchema = Joi.number().min(0);

exports.schemas = {
  email: emailSchema,
  price: priceSchema,
};

exports.joiSchemas = {
  email: emailJoiSchema,
  price: priceJoiSchema,
};
