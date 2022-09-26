const { validate } = require("../models/order");
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

  const cart = await Cart.findByIdAndRemove(orderBody.cart).select(
    "-_id -createdAt -updatedAt -__v"
  );

  if (!cart) return new Error("The cart with the given ID was not found.");

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
