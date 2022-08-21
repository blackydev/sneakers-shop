const express = require("express");
const router = express.Router();
const { Order, validate } = require("../models/order");
const { createCart } = require("../controllers/carts");
const { createCustomer } = require("../controllers/customers");
const p24 = require("../controllers/payment/przelewy24");
const { getHostURL } = require("../utils/url");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cart = await createCart(req.body.cart);
  if (_.isError(cart)) return res.status(400).send(cart);

  const customer = await createCustomer(req.body.customer);
  if (_.isError(customer)) return res.status(400).send(customer);

  let order = new Order(getProperties(customer, cart, "pending"));
  await order.save();
  const hostUrl = getHostURL(req);
  const result = await p24.createTransaction(order, hostUrl);
  if (_.isError(result)) return res.status(400).send(result);

  res.redirect(result);
});

const getProperties = (customer, cart, status) => {
  return {
    customer: customer,
    cart: cart,
    status: status,
  };
};

module.exports = router;
