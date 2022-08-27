const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const { Order, validate, paymentTimeLimit } = require("../models/order");
const { createCart, recreateReturnedCart } = require("../controllers/carts");
const { createCustomer } = require("../controllers/customers");
const { setInterruptedOrder } = require("../controllers/orders");
const p24 = require("../controllers/payment/p24");
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

  let order = new Order(getProperties(customer, cart, "pending"));
  await order.save();

  res.send(order);
});

router.post("/:id/payment", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || order.status === "interrupted")
    return res.status(404).send("The order with the given ID was not found.");

  order.p24.methodId = req.body.methodId;
  const hostUrl = getHostURL(req);

  const result = await p24.createTransaction(order, hostUrl);
  if (_.isError(result)) return res.status(400).send(result);

  setTimeout(async () => {
    await setInterruptedOrder(order._id);
  }, (paymentTimeLimit + 1) * 60 * 1000);

  res.send(result); //TODO: redirect
});

router.get("/:id/status", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order.status);
});

router.post("/:id/p24callback", validateObjectId, async (req, res) => {
  const verification = p24.verifyNotification(req.body);
  if (!verification) return res.status(400).send("Incorrect verification.");

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      p24: { _id: req.body.orderId },
    },
    { new: true }
  );

  if (req.body.amount != req.body.originAmount)
    return res.status(400).send("The order is not paid in full.");

  if (order.status === "interrupted") {
    const res = recreateReturnedCart(order.cart);
    if (_.isError(res)) return res.status(400).send("Order is interrupted.");
  }

  // TODO: NOTIFY FURGONETKA.PL

  const result = await p24.verifyTransaction(order);

  if (!result || _.isError(result))
    return res.status(400).send("Something has gone wrong.");

  await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "paid",
    },
    { new: true }
  );

  res.status(204);
});

const getProperties = (customer, cart, status) => {
  return {
    customer: customer,
    cart: cart,
    status: status,
  };
};

module.exports = router;
