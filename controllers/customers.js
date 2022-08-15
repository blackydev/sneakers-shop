const mongoose = require("mongoose");
const _ = require("lodash");
const { validate } = require("../models/customer");

exports.createCustomerFromJSON = async (customerBody) => {
  const { error } = validate(customerBody);
  if (error) return error;

  return _.pick(customerBody, [
    "name",
    "lastname",
    "email",
    "companyName",
    "street",
    "zip",
    "city",
    "phone",
  ]);
};
