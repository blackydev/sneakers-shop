const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");
const { calculateSHA384 } = require("../../utils/hash");

const merchantId = 187534;
const posId = 187534;
const crcKey = config.get("p24_crc");
const raportKey = "ce33570a9af0e85291c966f09c9ad973";

const p24URL =
  process.env.NODE_ENV === "production"
    ? "https://secure.przelewy24.pl"
    : "https://sandbox.przelewy24.pl";

const client = axios.create({
  baseURL: `${p24URL}/api/v1`,
  auth: {
    username: posId.toString(),
    password: raportKey,
  },
});

const createTransaction = async (order, hostURL) => {
  const customer = order.customer;
  const cart = order.cart;

  const hashData = {
    sessionId: order._id, // TODO:
    merchantId: merchantId, // TODO:
    amount: cart.amount * 100,
    currency: "PLN",
    crc: crcKey,
  };

  const sign = calculateSHA384(JSON.stringify(hashData));
  const request = {
    merchantId: merchantId,
    posId: posId,
    sessionId: order._id,
    amount: cart.amount * 100,
    currency: "PLN",
    description: "Transakcja sobie taka.", // TODO:
    email: customer.email,
    client: customer.name,
    address: customer.address,
    zip: customer.zip,
    city: customer.city,
    country: "PL",
    phone: customer.phone,
    language: "pl",
    urlReturn: `${hostURL}`, // TODO:
    urlStatus: `${hostURL}/api/orders/${order._id}/transaction-status`, // adres do przekazania statusu transakcji
    timeLimit: 30,
    waitForResult: true,
    shipping: 0, // TODO:
    transferLabel: config.get("shopName"),
    sign: sign,
  };
  try {
    const { data: result } = await client.post(
      `/transaction/register`,
      request
    );
    const token = result.data.token;
    return `${p24URL}/trnRequest/${token}`;
  } catch (error) {
    return error;
  }
};

const notifyTransaction = (req) => {
  const hashData = {
    ...req.body,
    crc: crcKey,
  };

  const sign = calculateSHA384(JSON.stringify(hashData));
  return sign == req.body.sign;
};

// const getPaymentMethods = () => {

// };

module.exports = {
  createTransaction: createTransaction,
  notifyTransaction: notifyTransaction,
};
