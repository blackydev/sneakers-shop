const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");

let token;
const client_id = 0;
const client_secret = 0;

const client = axios.create({
  baseURL: `${furURL}/oauth/authorize`,
  auth: {
    username: posId.toString(),
    password: raportKey,
  },
});

const getToken = async () => {

};

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
