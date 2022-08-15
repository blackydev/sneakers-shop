const Joi = require("joi");

const priceSchema = {
  type: Number,
  min: 0,
};

const priceJoiSchema = Joi.number().min(0);

exports.priceSchema = priceSchema;
exports.priceJoiSchema = priceJoiSchema;
