const { fullnameSchema, fullnameJoiSchema } = require("./fullname");
const { emailSchema, emailJoiSchema } = require("./email");
const { phoneSchema, phoneJoiSchema } = require("./phone");
const { zipSchema, zipJoiSchema } = require("./zip");
const { citySchema, cityJoiSchema } = require("./city");
const { addressSchema, addressJoiSchema } = require("./address");
const { companySchema, companyJoiSchema } = require("./company");
const { filenameSchema, filenameJoiSchema } = require("./filename");
const { priceSchema, priceJoiSchema } = require("./price");

exports.schemas = {
  fullname: fullnameSchema,
  email: emailSchema,
  phone: phoneSchema,
  zip: zipSchema,
  city: citySchema,
  address: addressSchema,
  company: companySchema,
  price: priceSchema,
  filename: filenameSchema,
};

exports.joiSchemas = {
  fullname: fullnameJoiSchema,
  email: emailJoiSchema,
  phone: phoneJoiSchema,
  zip: zipJoiSchema,
  city: cityJoiSchema,
  address: addressJoiSchema,
  company: companyJoiSchema,
  price: priceJoiSchema,
  filename: filenameJoiSchema,
};
