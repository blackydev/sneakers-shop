const { joiSchemas } = require("../../models/utils/schemas");
const Auth = require("./auth");
const Joi = require("joi");
const config = require("config");

const getDeliverers = async () => {
  try {
    const { data } = await Auth.axiosClient.get("/account/services");
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
    const { data } = await Auth.axiosClient.post("/points/map", request);

    return data;
  } catch (error) {
    return new Error(error.message);
  }
};

const createDelivery = async (order, serviceId) => {
  const customer = order.customer;

  const request = {
    pickup: config.get("pickup"),
    receiver: {
      street: customer.address,
      postCode: customer.zip,
      city: customer.city,
      name: customer.name,
      company: customer.companyName,
      email: customer.email,
      phone: customer.phone,
      point: order.deliveryPoint,
    },
    service_id: serviceId,
    parcels: [{ type: "package" }],
  };

  try {
    const { data } = await Auth.axiosClient.post("/packages", request);
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
