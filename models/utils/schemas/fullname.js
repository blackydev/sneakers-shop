const Joi = require("joi");

const Schema = {
  type: String,
  minlength: 3,
  maxlength: 512,
  trim: true,
};

const JoiSchema = Joi.string().min(3);

exports.fullnameSchema = Schema;
exports.fullnameJoiSchema = JoiSchema;
