const axios = require("axios").default;
const _ = require("lodash");
const authController = require("./AuthController");
authController.init();

const getDeliverers = async () => {
  try {
    const { data } = await authController.axiosClient.get("/account/services");
    return data;
  } catch (error) {
    return error.message;
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
    return error.message;
  }
};

module.exports = {
  getDeliverers,
  getPoints,
};
