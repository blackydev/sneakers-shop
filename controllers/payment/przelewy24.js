const axios = require("axios").default;
const config = require("config");
const { calculateSHA384 } = require("../../utils/hash");

const merchantId = 187534;
const posId = 187534;
const crcKey = config.get("p24_crc");

const p24URL =
  process.env.NODE_ENV === "production"
    ? "https://secure.przelewy24.pl/api/v1"
    : "https://sandbox.przelewy24.pl/api/v1";

const createTransaction = async (order, hostURL) => {
  const hashData = {
    sessionId: order._id, // TODO:
    merchantId: merchantId, // TODO:
    amount: order.amount,
    currency: "PLN",
    crc: crcKey,
  };

  const sign = calculateSHA384(JSON.stringify(hashData));

  const customer = order.customer;
  // const cart = order.cart;
  const request = {
    merchantId: merchantId,
    posId: posId,
    sessionId: order._id,
    amount: order.amount * 100,
    currency: "PLN",
    description: "Transakcja", // TODO:
    email: customer.email,
    client: customer.name + " " + customer.lastname,
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
    const result = await axios.post(p24URL + "/transaction/register", request);
    const { token } = result;
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
