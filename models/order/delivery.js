const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("../utils/schemas");

const methods = [
  /*
    0 - PERSONAL PICKUP
    1 - CARRIER
    2 - INPOST POINT
    3 - OTHER POINT
  */
  {
    name: "personal pickup",
    price: 0,
    point: false,
  },
  {
    name: "carrier",
    price: 20,
    point: false,
  },
  {
    name: "inpost point",
    price: 10,
    point: true,
  },
  {
    name: "orlen point",
    price: 10,
    point: true,
  },
];

const deliverySchema = new mongoose.Schema({
  method: {
    type: Number,
    required: true,
  },
  price: {
    ...schemas.price,
    required: true,
  },
  point: {
    type: String,
  },
});

function validateDelivery(delivery) {
  const method = delivery.method;
  const schema = Joi.object({
    method: Joi.number().required(),
    price: joiSchemas.price,
    point: Joi.string().custom((v, helper) => {
      return methods[method] ? true : helper.message("Empty point value.");
    }),
  });

  return schema.validate(delivery);
}

module.exports = {
  deliverySchema,
  validate: validateDelivery,
  deliveryMethods: methods,
};
