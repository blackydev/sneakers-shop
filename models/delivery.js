const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./utils/schemas");

const deliverySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      ...schemas.price,
      required: true,
    },

    furgonetka: {
      id: {
        type: Number,
      },

      points: {
        type: String, // if exists write here name which is used to get points at furgonetka.pl
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

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
    name: Joi.string().required(),
    price: joiSchemas.price.required(),
    furgonetka: Joi.object().keys({
      id: Joi.number(),
      points: Joi.string(),
    }),
  });

  return schema.validate(delivery);
}

module.exports = {
  Delivery,
  deliverySchema,
  validate: validateDelivery,
};
