const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const { Order, validate, paymentTimeLimit } = require("../models/order");
const {
  createCart,
  recreateReturnedCart,
} = require("../controllers/orders/carts");
const { createCustomer } = require("../controllers/orders/customers");
const { createDelivery } = require("../controllers/orders/delivery");
const { setInterruptedOrder } = require("../controllers/orders");
const p24 = require("../controllers/p24");
const { getHostURL } = require("../utils/url");
const { auth, isAdmin } = require("../middleware/authorization");
const _ = require("lodash");

router.get("/", [auth, isAdmin], async (req, res) => {
  const { select, sortBy } = req.query;
  const orders = await Order.find().select(select).sort(sortBy);
  res.send(orders);
});

router.get("/:id", [auth, isAdmin], async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cart = await createCart(req.body.cart);
  if (_.isError(cart)) return res.status(400).send(cart.message);

  const customer = await createCustomer(req.body.customer);
  if (_.isError(customer)) return res.status(400).send(customer.message);

  const delivery = await createDelivery(req.body.delivery);
  if (_.isError(delivery)) return res.status(400).send(delivery.message);

  let order = new Order(getProperties(customer, cart, delivery, "pending"));
  await order.save();

  res.send(order);
});

router.get("/:id/status", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order.status);
});

const getProperties = (customer, cart, delivery, status) => {
  return {
    customer: customer,
    cart: cart,
    delivery: delivery,
    totalAmount: cart.amount + delivery.price,
    status: status,
  };
};

module.exports = router;
