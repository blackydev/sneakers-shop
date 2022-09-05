const Joi = require("joi");
const mongoose = require("mongoose");
const { schemas, joiSchemas } = require("../utils/schemas");

const deliverySchema = new mongoose.Schema({
  serviceId: {
    type: Number,
  },
  price: {
    ...schemas.price,
    required: true,
  },
  point: {
    type: String,
  },
});

const Delivery = mongoose.model("deliveries", deliverySchema);

function validateDelivery(delivery) {
  const schema = Joi.object({});

  return schema.validate(delivery);
}

module.exports = {
  deliverySchema,
  validate: validateDelivery,
};
