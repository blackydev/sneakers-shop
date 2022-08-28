const axios = require("axios").default;
const _ = require("lodash");
const authController = require("./AuthController");
authController.init();

const getDeliverers = async () => {
  try {
    const { data } = await authController.axiosClient.get(
      "/account/services");
    return data;
  } catch (error) {
    return error;
  }
};

const addDelivery = async (order) => {
  const request = {

  };

  try {
    const { data } = await authController.axiosClient.get(
      "/account/services");
    return data;
  } catch (error) {
    return error;
  }
};

const createDeliveryRequest = (order, serviceId) => {
  const customer = order.customer;
  const cart = order.cart;
  const parcels = [];
  for (const product of order.cart.products) {

  }

  const request = {
    pickup: {
      street: config.get("address"),
      postcode: config.get("zip"),
      city: config.get("city"),
      name: config.get("name"),
      company: config.get("companyName"),
      country_code: "PL",
      email: config.get("email"),
      phone: config.get("phone"),
      point: "" //TODO:
    },
    receiver: {
      street: customer.address,
      postcode: customer.zip,
      city: customer.city,
      name: customer.name,
      company: customer.companyName,
      country_code: "PL",
      email: customer.email,
      phone: customer.phone,
      point: "" //TODO:
    },
    service_id: serviceId,
    parcels: parcels,
    sender: {
      street: config.get("address"),
      postcode: config.get("zip"),
      city: config.get("city"),
      name: config.get("name"),
      company: config.get("companyName"),
      country_code: "PL",
      email: config.get("email"),
      phone: config.get("phone"),
    },
    user_reference_number: order._id,

  }
}

module.exports = {
  getDeliverers,
}

