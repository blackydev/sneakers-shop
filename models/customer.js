const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("../utils/schemaProps");

const customerSchema = new mongoose.Schema(
  {
    _id: { id: false },
    name: {
      type: String,
      minlength: 3,
      maxlength: 256,
      trim: true,
      required: true,
    },
    email: { ...schemas.email, required: true },
    company: { type: String, minlength: 0, maxlength: 255 },
    address: {
      type: String,
      minlength: 1,
      maxlength: 255,
      lowercase: true,
      required: true,
    },
    zip: {
      type: String,
      minlength: 3,
      maxlength: 12,
      trim: true,
      required: true,
    },
    city: { type: String, minlength: 1, maxlength: 28, required: true },
    phone: {
      type: String,
      minlength: 5,
      maxlength: 16,
      set: (num) => num.replaceAll(/([-+() ])/g, ""),
      required: true,
    },
  },
  {
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  },
);

const joiSchema = Joi.object({
  name: Joi.string().min(3).max(256).required(),
  email: joiSchemas.email.required(),
  company: Joi.string().min(0).max(255),
  address: Joi.string().min(1).max(255).required(),
  zip: Joi.string().min(3).max(12).required(),
  city: Joi.string().min(1).max(28).required(),
  phone: Joi.string().min(5).max(16).required(),
});

function validate(customer) {
  return joiSchema.validate(customer);
}

module.exports = {
  customerSchema,
  validate,
  joiSchema,
};
