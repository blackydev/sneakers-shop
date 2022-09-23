const { validate } = require("../models/order");
const { useCart } = require("./carts");
const { createCustomer } = require("./customers");
const { createDelivery } = require("./delivery");
const { Order } = require("../models/order");
const _ = require("lodash");

const createOrder = async (orderBody) => {
  const { error } = validate(orderBody);
  if (error) return error;

  const customer = await createCustomer(orderBody.customer);
  if (_.isError(customer)) return customer;

  const delivery = await createDelivery(orderBody.delivery);
  if (_.isError(delivery)) return delivery;

  const status = orderBody.status;

  const cart = await useCart(orderBody.cart);
  if (_.isError(cart)) return cart;

  const properties = getOrderProperties(customer, cart, delivery, status);

  const order = new Order(properties);
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

module.exports = {
  createOrder,
};
