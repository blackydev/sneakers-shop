const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");
const { calculateSHA384 } = require("../utils/hash");
const { paymentTimeLimit } = require("../models/order");
const winston = require("winston");

const merchantId = config.get("p24.merchantId");
const posId = config.get("p24.posId");
const crcKey = config.get("p24.crc");
const raportKey = config.get("p24.raportKey");

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
  try {
    const customer = order.customer;
    const cart = order.cart;
    const delivery = order.delivery;

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
      amount: order.totalCost * 100,
      currency: "PLN",
      description: config.get("websiteName"),
      email: customer.email,
      client: customer.name,
      address: customer.address,
      zip: customer.zip,
      city: customer.city,
      country: "PL",
      method: order.p24.methodId,
      phone: customer.phone,
      language: "pl",
      urlReturn: `${hostURL}/api/orders/${order._id}/status`,
      urlStatus: `${hostURL}/api/p24/callback/${order._id}`,
      timeLimit: paymentTimeLimit,
      waitForResult: true,
      shipping: delivery.cost,
      transferLabel: config.get("websiteName"),
      sign: sign,
    };
    const { data: result } = await client.post(
      "/transaction/register",
      request
    );

    const token = result.data.token;
    return `${p24URL}/trnRequest/${token}`;
  } catch (error) {
    return error.message;
  }
};

const verifyNotification = (notificationRequest) => {
  const notificationHash = {
    merchantId: notificationRequest.merchantId,
    posId: notificationRequest.posId,
    sessionId: notificationRequest.sessionId,
    amount: notificationRequest.amount,
    originAmount: notificationRequest.originAmount,
    currency: notificationRequest.currency,
    orderId: notificationRequest.orderId,
    methodId: notificationRequest.methodId,
    statement: notificationRequest.statement,
    crc: crcKey,
  };

  const sign = calculateSHA384(JSON.stringify(notificationHash));
  return sign === notificationRequest.sign;
};

const verifyTransaction = async (order) => {
  try {
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

    const { data: result } = await client.put("/transaction/verify", request);
    return result.data.status === "success";
  } catch (error) {
    return error.message;
  }
};

const getPaymentMethods = async (language) => {
  try {
    const { data: result } = await client.get(`/payment/methods/${language}`);
    return result.data;
  } catch (error) {
    return error.message;
  }
};

const test = async () => {
  try {
    const { data: result } = await client.get("testAccess");
    return result.data === true;
  } catch (error) {
    return error.message;
  }
};

const getTransactionData = async (p24Id) => {
  try {
    const { data: result } = await client.get(
      `/transaction/by/sessionId/${p24Id}`
    );
    return result.data;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  createTransaction,
  verifyNotification,
  verifyTransaction,
  getPaymentMethods,
  test,
  getTransactionData,
};
