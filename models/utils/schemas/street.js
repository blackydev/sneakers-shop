const Joi = require("joi");

const streetSchema = {
  type: String,
  minlength: 1,
  maxlength: 255,
};

const streetJoiSchema = Joi.string().min(1).max(255);

exports.streetSchema = streetSchema;
exports.streetJoiSchema = streetJoiSchema;
