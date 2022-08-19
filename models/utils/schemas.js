const { nameSchema, nameJoiSchema } = require("./schemas/name");
const { emailSchema, emailJoiSchema } = require("./schemas/email");
const { phoneSchema, phoneJoiSchema } = require("./schemas/phone");
const { zipSchema, zipJoiSchema } = require("./schemas/zip");
const { citySchema, cityJoiSchema } = require("./schemas/city");
const { addressSchema, addressJoiSchema } = require("./schemas/address");
const {
  companyNameSchema,
  companyNameJoiSchema,
} = require("./schemas/companyName");
const { priceSchema, priceJoiSchema } = require("./schemas/price");

exports.schemas = {
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  zip: zipSchema,
  city: citySchema,
  address: addressSchema,
  companyName: companyNameSchema,
  price: priceSchema,
};

exports.joiSchemas = {
  name: nameJoiSchema,
  email: emailJoiSchema,
  phone: phoneJoiSchema,
  zip: zipJoiSchema,
  city: cityJoiSchema,
  address: addressJoiSchema,
  companyName: companyNameJoiSchema,
  price: priceJoiSchema,
};
