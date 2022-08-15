const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");

const customerSchema = new mongoose.Schema({
  name: { ...schemas.name, required: true },
  lastname: { ...schemas.name, required: true },
  email: { ...schemas.email, required: true },
  companyName: { ...schemas.companyName },
  street: { ...schemas.street, required: true },
  zip: { ...schemas.zip, required: true },
  city: { ...schemas.city, required: true },
  phone: { ...schemas.phone, required: true },
});

const Customer = mongoose.model("customers", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: joiSchemas.name.required(),
    lastname: joiSchemas.name.required(),
    email: joiSchemas.email.required(),
    companyName: joiSchemas.companyName,
    street: joiSchemas.street.required(),
    zip: joiSchemas.zip.required(),
    city: joiSchemas.city.required(),
    phone: joiSchemas.phone.required(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
