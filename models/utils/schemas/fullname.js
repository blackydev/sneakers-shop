const Joi = require("joi");

const Schema = {
  type: String,
  minlength: 3,
  maxlength: 256,
  trim: true,
};

const JoiSchema = Joi.string().min(3).max(256);

exports.fullnameSchema = Schema;
exports.fullnameJoiSchema = JoiSchema;
