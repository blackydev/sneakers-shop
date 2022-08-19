const config = require("config");
const {calculateSHA384} = require("../../utils/hash");

const transactionRegister = (order) => {
  const hashData = {
    sessionId: ,// TODO:
    merchantId: , // TODO:
    amount: order.amount,
    currency: "PLN",
    crc: this.crcKey,
  };

  const customer = order.customer;
  const cart = order.cart;
  const object = {
    merchantId: "ID Sklepu", // TODO:
    posId: "ID Sklepu (domyślnie ID Sprzedawcy)", // TODO:
    sessionId: order._id,
    amount: order.amount * 100,
    currency: "PLN",
    description: "string", // TODO:
    email: customer.email,
    client: customer.name + " " + customer.lastname,
    address: customer.address,
    zip: customer.zip,
    city: customer.city,
    country: "PL",
    phone: customer.phone,
    language: "pl",
    method: TODO, // TODO:
    urlReturn: "string",
    urlStatus: "string",
    timeLimit: 30,
    waitForResult: true,
    shipping: 0, // TODO:
    transferLabel: config.get("shopName"),
    sign: "string", // TODO:
    methodRefId: "string", // TODO:
    additional: {
      shipping: {}, // TODO:
    },
  };
};

const transactionVerify = () => {};
