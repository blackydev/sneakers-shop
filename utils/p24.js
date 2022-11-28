const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");
const { calculateSHA384 } = require("./hash");
const { paymentTimeLimit } = require("../models/order");

const merchantId = config.get("p24.merchantId");
const posId = config.get("p24.posId");
const crcKey = config.get("p24.crc");
const raportKey = config.get("p24.raportKey");
const currency = "USD";
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
    const hashData = {
      sessionId: order._id,
      merchantId: merchantId,
      amount: order.totalCost * 100,
      currency,
      crc: crcKey,
    };
    const totalCost = (await order.getTotalCost()) * 100;
    const sign = calculateSHA384(JSON.stringify(hashData));
    const request = {
      channel: 16,
      merchantId: merchantId,
      posId: posId,
      sessionId: order._id,
      amount: totalCost,
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
      urlReturn: `${config.get("clientUrl")}/my-orders/${order._id}?key=${
        order.createdAt
      }`,
      urlStatus: `${hostURL}/api/orders/${order._id}/p24Callback`,
      timeLimit: paymentTimeLimit,
      waitForResult: true,
      shipping: order.deliveryCost * 100,
      transferLabel: `Order`,
      sign: sign,
    };
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
    const cart = order.cart;

    const hashData = {
      sessionId: order._id,
      orderId: order.p24Id,
      amount: cart.amount * 100,
      currency,
      crc: crcKey,
    };

    const sign = calculateSHA384(JSON.stringify(hashData));

    const request = {
      merchantId: merchantId,
      posId: posId,
      sessionId: order._id,
      amount: cart.amount * 100,
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
