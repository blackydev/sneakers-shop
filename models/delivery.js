const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");

const deliverySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    ...schemas.price,
    required: true,
  },
  points: {
    type: Boolean,
  },
  serviceId: {
    type: Number,
    required: true,
  },
});

/*[{
    "name": "personal pickup",
    "price": 0,
    "point": false,
  },
  {
    "name": "carrier",
    "price": 20,
    "point": false,
  },
  {
    "name": "inpost",
    "price": 10,
    "point": true,
  },
  {
    "name": "orlen",
    "price": 10,
    "point": true,
  }]
  */

const Delivery = mongoose.model("deliveries", deliverySchema);

function validateDelivery(delivery) {
  const schema = Joi.object({
    name: Joi.number().required(),
    price: joiSchemas.price.required(),
    point: Joi.string(),
    serviceId: Joi.number().required(),
  });

  return schema.validate(delivery);
}

module.exports = {
  Delivery,
  deliverySchema,
  validate: validateDelivery,
};