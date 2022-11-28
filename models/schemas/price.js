const Joi = require("joi");

const priceSchema = {
  type: Number,
  min: 0,
  get: (num) => num / 100,
  set: (num) => Math.round(num * 100),
};

const priceJoiSchema = Joi.number().min(0);

exports.priceSchema = priceSchema;
exports.priceJoiSchema = priceJoiSchema;
