const { joiSchemas } = require("../../models/utils/schemas");
const authController = require("./AuthController");
const Joi = require("joi");

if (process.env.offline) authController.init();

validatePickup = (pickup) => {
  const schema = Joi.object({
    street: joiSchemas.address.required(),
    postCode: joiSchemas.zip.required(),
    city: joiSchemas.city.required(),
    name: joiSchemas.name.required(),
    company: joiSchemas.companyName(),
    country_code: Joi.string(),
    country: Joi.string(),
    email: joiSchemas.email,
    phone: joiSchemas.phone,
    point: joiSchemas.point,
  });

  return schema.validate(pickup);
};

validatePackages = (packages) => {
  const schema = Joi.object()
    .keys({
      width: Joi.number().integer(),
      depth: Joi.number().integer(),
      height: Joi.number().integer(),
      value: Joi.number(),
      description: Joi.string(),
    })
    .required();

  return schema.validate(packages);
};

const getDeliverers = async () => {
  try {
    const { data } = await authController.axiosClient.get("/account/services");
    return data;
  } catch (error) {
    return new Error(error.message);
  }
};

const getPoints = async (services, searchPhrase) => {
  const request = {
    location: {
      search_phrase: searchPhrase,
      address: { country_code: "PL" },
    },
    filters: {
      services: services,
    },
  };

  try {
    const { data } = await authController.axiosClient.post(
      "/points/map",
      request
    );
    return data;
  } catch (error) {
    return new Error(error.message);
  }
};

const createDelivery = async (pickup, order, serviceId, packages) => {
  const { error: pickupError } = validatePickup(pickup);
  if (pickupError) return pickupError;

  const { error: packageError } = validatePackages(packages);
  if (packageError) return packageError;

  const customer = order.customer;
  const delivery = order.delivery;

  const request = {
    pickup,
    receiver: {
      street: customer.address,
      postCode: customer.zip,
      city: customer.city,
      name: customer.name,
      company: customer.companyName,
      email: customer.email,
      phone: customer.phone,
      point: delivery.point,
    },
    service_id: serviceId,
    parcels: packages,
  };

  try {
    const { data } = await authController.axiosClient.post(
      "/packages",
      request
    );
    return data;
  } catch (error) {
    return new Error(error.message);
  }
};

module.exports = {
  getDeliverers,
  getPoints,
  createDelivery,
};
