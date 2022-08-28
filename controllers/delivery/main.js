const axios = require("axios").default;
const _ = require("lodash");
const auth = require("./auth");
auth.init();

const furgonetkaURL =
  process.env.NODE_ENV === "production"
    ? "https://api.furgonetka.pl"
    : "https://api-test.furgonetka.pl";

const getDeliverers = async () => {
  try {
    const { data } = await auth.axiosClient.get(
      "/account/services"
    );
    return data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getDeliverers,
}

