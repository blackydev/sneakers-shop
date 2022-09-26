const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");

const customerSchema = new mongoose.Schema({
  _id: { id: false },
  name: { ...schemas.fullname, required: true },
  email: { ...schemas.email, required: true },
  company: { ...schemas.company },
  address: { ...schemas.address, required: true },
  zip: { ...schemas.zip, required: true },
  city: { ...schemas.city, required: true },
  phone: { ...schemas.phone, required: true },
});

const joiSchema = Joi.object({
  name: joiSchemas.fullname.required(),
  email: joiSchemas.email.required(),
  company: joiSchemas.company,
  address: joiSchemas.address.required(),
  zip: joiSchemas.zip.required(),
  city: joiSchemas.city.required(),
  phone: joiSchemas.phone.required(),
});

function validate(customer) {
  return joiSchema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.validate = validate;
exports.joiSchema = joiSchema;