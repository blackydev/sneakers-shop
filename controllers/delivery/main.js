const axios = require("axios").default;
const _ = require("lodash");

const furURL =
  process.env.NODE_ENV === "production"
    ? "https://api.furgonetka.pl"
    : "https://api-test.furgonetka.pl";

const client = axios.create({
  baseURL: `${furURL}/oauth/authorize`,
  authorizationCode: "",
});

const getDeliverers = async () => {
  try {
    const { data: result } = await client.get(
      `/account/services`
    );
    return result.data.services;
  } catch (error) {
    return error;
  }
};

