const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { createCart } = require("../controllers/carts");
const { createCustomer } = require("../controllers/customers");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cart = createCart(req.body.cart);
  if (_.isError(cart)) return res.status(400).send(cart);

  const customer = createCustomer(req.body.customer);
  if (_.isError(customer)) return res.status(400).send(customer);

  let order = new Order(getProperties(customer, cart, "pending"));
  await order.save();

  res.send(order);
});

const getProperties = (customer, cart, status) => {
  return {
    customer: customer,
    cart: cart,
    status: status,
  };
};

module.exports = router;
