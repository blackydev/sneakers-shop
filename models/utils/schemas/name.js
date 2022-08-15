const Joi = require("joi");

const nameSchema = {
  type: String,
  minlength: 3,
  maxlength: 256,
  trim: true,
};

const nameJoiSchema = Joi.string().min(3);

exports.nameSchema = nameSchema;
exports.nameJoiSchema = nameJoiSchema;
