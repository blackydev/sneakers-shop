const { fullnameSchema, fullnameJoiSchema } = require("./schemas/fullname");
const { emailSchema, emailJoiSchema } = require("./schemas/email");
const { phoneSchema, phoneJoiSchema } = require("./schemas/phone");
const { zipSchema, zipJoiSchema } = require("./schemas/zip");
const { citySchema, cityJoiSchema } = require("./schemas/city");
const { addressSchema, addressJoiSchema } = require("./schemas/address");
const { companySchema, companyJoiSchema } = require("./schemas/company");
const { priceSchema, priceJoiSchema } = require("./schemas/price");

exports.schemas = {
  fullname: fullnameSchema,
  email: emailSchema,
  phone: phoneSchema,
  zip: zipSchema,
  city: citySchema,
  address: addressSchema,
  company: companySchema,
  price: priceSchema,
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
};
