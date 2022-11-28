const Joi = require("joi");

const filenameSchema = {
  type: String,
  maxlength: 260,
};

const filenameJoiSchema = Joi.string().max(260).allow("").required();

exports.filenameSchema = filenameSchema;
exports.filenameJoiSchema = filenameJoiSchema;
