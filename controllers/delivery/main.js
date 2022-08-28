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

module.exports = {
  getDeliverers,
}

