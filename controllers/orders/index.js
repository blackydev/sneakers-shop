const { validate } = require("../../models/order");
const { createCart } = require("./carts");
const { createCustomer } = require("./customers");
const { createDelivery } = require("../delivery");
const { Order } = require("../../models/order");
const _ = require("lodash");
const winston = require("winston");

exports.createOrder = async (orderBody) => {
  const { error } = validate(orderBody);
  if (error) return error;

  const cart = await createCart(orderBody.cart);
  if (_.isError(cart)) return cart;

  const customer = await createCustomer(orderBody.customer);
  if (_.isError(customer)) return customer;

  const delivery = await createDelivery(orderBody.delivery);
  if (_.isError(delivery)) return delivery;

  const status = orderBody.status;
  const properties = getOrderProperties(customer, cart, delivery, status);

  const order = new Order(properties);
  winston.info(JSON.stringify(order));
  return order;
};

const getOrderProperties = (customer, cart, delivery, status) => {
  return {
    customer: customer,
    cart: cart,
    delivery: delivery,
    totalCost: cart.amount + delivery.cost,
    status: status,
  };
};
