const mongoose = require("mongoose");
const _ = require("lodash");
const { validate, deliveryMethods } = require("../../models/order/delivery");

exports.createDelivery = (deliveryBody) => {
  const { error } = validate(deliveryBody);
  if (error) return error;

  const delivery = deliveryMethods[deliveryBody.method];

  return delivery;
};
