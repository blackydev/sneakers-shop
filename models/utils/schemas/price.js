const Joi = require("joi");
const winston = require("winston");

const priceSchema = {
  type: Number,
  min: 0,
};

const priceJoiSchema = Joi.number()
  .min(0)
  .custom((v, helper) => {
    return v.countDecimals() <= 2
      ? true
      : helper.message("Too many decimal places in price.");
  });

exports.priceSchema = priceSchema;
exports.priceJoiSchema = priceJoiSchema;
