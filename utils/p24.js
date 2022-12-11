const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");
const { calculateSHA384 } = require("./hash");
const { paymentTimeLimit } = require("../models/order");

const merchantId = config.get("p24.merchantId");
const posId = config.get("p24.posId");
const crcKey = config.get("p24.crc");
const raportKey = config.get("p24.raportKey");
const currency = "PLN";
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
  const amount = (await order.getTotalPrice()) * 100;
  const { customer } = order;
  const hashData = {
    sessionId: order._id,
    merchantId,
    amount,
    currency,
    crc: crcKey,
  };
  const sign = calculateSHA384(JSON.stringify(hashData));
  const request = {
    channel: 16,
    merchantId,
    posId: posId,
    sessionId: order._id,
    amount,
    currency,
    description: `${config.get("clientUrl")}/my-orders/${order._id}?key=${
      order.createdAt
    }`,
    email: customer.email,
    client: customer.name,
    address: customer.address,
    zip: customer.zip,
    city: customer.city,
    country: "PL",
    phone: customer.phone,
    language: "en",
    urlReturn: config.get("clientUrl"),
    urlStatus: `${hostURL}/api/orders/${order._id}/p24Callback`,
    timeLimit: paymentTimeLimit,
    waitForResult: true,
    shipping: order.deliveryPrice * 100,
    transferLabel: `Order`,
    sign: sign,
  };
  try {
    const { data: result } = await client.post(
      "/transaction/register",
      request
    );

    const token = result.data.token;
    return `${p24URL}/trnRequest/${token}`;
  } catch (error) {
    return new Error(error.message);
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
    const amount = (await order.getTotalPrice()) * 100;

    const hashData = {
      sessionId: order._id,
      orderId: order.p24Id,
      amount,
      currency,
      crc: crcKey,
    };

    const sign = calculateSHA384(JSON.stringify(hashData));

    const request = {
      merchantId,
      posId: posId,
      sessionId: order._id,
      amount,
      currency,
      orderId: order.p24Id,
      sign: sign,
    };

    const { data: result } = await client.put("/transaction/verify", request);
    return result.data.status === "success";
  } catch (error) {
    return new Error(error.message);
  }
};

const test = async () => {
  try {
    const { data: result } = await client.get("testAccess");
    return result.data === true;
  } catch (error) {
    return new Error(error.message);
  }
};

module.exports = {
  createTransaction,
  verifyNotification,
  verifyTransaction,
  test,
};
