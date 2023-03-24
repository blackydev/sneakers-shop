const axios = require("axios").default;
const config = require("config");
const _ = require("lodash");
const { calculateSHA384 } = require("./hash");
const merchantId = parseInt(config.get("p24.merchantId"));
const posId = config.get("p24.posId").toString();
const crcKey = config.get("p24.crc");
const raportKey = config.get("p24.raportKey");
const currency = "PLN";
const p24URL = "https://sandbox.przelewy24.pl";
const paymentTimeLimit = 15;

const client = axios.create({
  baseURL: `${p24URL}/api/v1`,
  auth: {
    username: posId,
    password: raportKey,
  },
});

const createTransaction = async (order, hostURL) => {
  const amount = Math.round((await order.getTotalPrice()) * 100);
  const { customer } = order;
  const hashData = {
    sessionId: order._id.toString(),
    merchantId: merchantId,
    amount: amount,
    currency: currency,
    crc: crcKey,
  };
  const sign = calculateSHA384(hashData);
  const request = {
    channel: 16,
    merchantId: merchantId,
    posId: posId,
    sessionId: order._id.toString(),
    amount: amount,
    currency: currency,
    description: "Thank you for order.",
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
    shipping: order.delivery.price * 100,
    transferLabel: `Sneakers shop - order`,
    sign: sign,
  };
  try {
    const { data: result } = await client.post(
      "/transaction/register",
      request,
    );
    const token = result.data.token;
    return token;
  } catch (error) {
    return new Error(error.message);
  }
};

const verifyNotification = (req) => {
  const notification = {
    ..._.pick(req, [
      "merchantId",
      "posId",
      "sessionId",
      "amount",
      "originAmount",
      "currency",
      "orderId",
      "methodId",
      "statement",
    ]),
    crc: crcKey,
  };

  const sign = calculateSHA384(notification);
  return sign === req.sign;
};

const verifyTransaction = async (order) => {
  const amount = (await order.getTotalPrice()) * 100;

  const hashData = {
    sessionId: order._id.toString(),
    orderId: order.p24Id,
    amount: amount,
    currency: currency,
    crc: crcKey,
  };

  const sign = calculateSHA384(hashData);

  const request = {
    merchantId,
    posId: posId,
    sessionId: order._id.toString(),
    amount: amount,
    currency: currency,
    orderId: order.p24Id,
    sign: sign,
  };
  try {
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
