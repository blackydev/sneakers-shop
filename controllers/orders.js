const { Order, validate } = require("../models/order");
const { createCartFromJSON } = require("./carts");
const { createCustomerFromJSON } = require("./customers");
const _ = require("lodash");
const express = require("express");

const postOrder = async (req, res) => {
  let order = createOrderFromJSON(req.body);
  order = new Order(order);
  await order.save();

  res.send(order);
};

const createOrderFromJSON = async (orderBody) => {
  const { error } = validate(orderBody);
  if (error) return error.details[0].message;

  const customer = await createCustomerFromJSON(orderBody.customer);
  if (_.isError(customer)) return customer;

  const cart = await createCartFromJSON(orderBody.cart);
  if (_.isError(cart)) return cart;

  let amount = 0;

  for (const product of cart.products)
    amount += product.price * product.quantity;

  return {
    customer: customer,
    cart: cart,
    amount: amount,
  };
};

module.exports = {
  post: postOrder,
  createOrderFromJSON: createOrderFromJSON,
};
