const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");
const { calculateSHA384 } = require("../../utils/hash");
const { paymentTimeLimit } = require("../../models/order");

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
    sessionId: order._id,
    merchantId: merchantId,
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
    description: `${hostURL}`,
    email: customer.email,
    client: customer.name,
    address: customer.address,
    zip: customer.zip,
    city: customer.city,
    country: "PL",
    phone: customer.phone,
    language: "pl",
    urlReturn: `https://www.google.com/`, // TODO:
    urlStatus: `${hostURL}/api/orders/${order._id}/notification/p24`, // adres do przekazania statusu transakcji
    timeLimit: paymentTimeLimit,
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
    console.log(request.urlStatus);

    const token = result.data.token;
    return `${p24URL}/trnRequest/${token}`;
  } catch (error) {
    return error;
  }
};

const verifyNotification = (notificationRequest) => {
  const notificationHash = {
    ...notificationRequest,
    sign: undefined,
    crc: crcKey,
  };

  const sign = calculateSHA384(JSON.stringify(notificationHash));
  return sign === notificationRequest.sign;
};

const verifyTransaction = async (order) => {
  const cart = order.cart;

  const hashData = {
    sessionId: order._id,
    orderId: order.p24._id,
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
    orderId: order.p24._id,
    sign: sign,
  };
  try {
    const { data: result } = await client.post("/transaction/verify", request);
    return result.data.status === "success";
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTransaction: createTransaction,
  verifyNotification: verifyNotification,
  verifyTransaction: verifyTransaction,
};
