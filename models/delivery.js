const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("./schemas");

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
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const Delivery = mongoose.model("deliveries", deliverySchema);

function validateDelivery(delivery) {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: joiSchemas.price.required(),
  });

  return schema.validate(delivery);
}

module.exports = {
  Delivery,
  deliverySchema,
  validate: validateDelivery,
};
