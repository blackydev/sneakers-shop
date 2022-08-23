const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");

const delivURL =
  process.env.NODE_ENV === "production"
    ? "https://api.furgonetka.pl"
    : "https://api-test.furgonetka.pl";

const client = axios.create({
  baseURL: `${p24URL}/api/v1`,
  auth: {
    username: posId.toString(),
    password: raportKey,
  },
});

const getTransactionData = async (p24Id) => {
  try {
    const { data: result } = await client.get(
      `/transaction/by/sessionId/${p24Id}`
    );
    return result.data;
  } catch (error) {
    return error;
  }
};

module.exports = {};
