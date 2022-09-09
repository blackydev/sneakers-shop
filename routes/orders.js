const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const { Order, validate, paymentTimeLimit } = require("../models/order");
const {
  createCart,
  recreateReturnedCart,
} = require("../controllers/orders/carts");
const { createCustomer } = require("../controllers/orders/customers");
const { createDelivery } = require("../controllers/delivery");
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
  /*
request: 
{
  cart: {...}, customer: {...}, delivery: {id, ?point}
}
  */
  req.body.status = "pending";
  try {
    validate(req.body);
    var cart = await createCart(req.body.cart);
    var customer = await createCustomer(req.body.customer);
    var delivery = await createDelivery(req.body.delivery);
  } catch (err) {
    return res.status(400).send(err);
  }

  const status = req.body.status;

  let order = new Order(getProperties(customer, cart, delivery, status));
  await order.save();

  res.send(order);
});

router.put("/:id", [auth, isAdmin], async (req, res) => {
  /* request: 
  the same as in the post method + status
  */
  try {
    validate(req.body);
    var cart = await createCart(req.body.cart);
    var customer = await createCustomer(req.body.customer);
    var delivery = await createDelivery(req.body.delivery);
  } catch (err) {
    return res.status(400).send(err);
  }

  const status = req.body.status;

  let order = new Order(
    req.params.id,
    getProperties(customer, cart, delivery, status),
    { new: true }
  );
  await order.save();

  res.send(order);
});

router.post("/:id/payment", validateObjectId, async (req, res) => {
  /*
  request
  {
    paymentMethodId, - (from p24)
  }
  */
  const order = await Order.findById(req.params.id);
  if (!order || order.status == "interrupted")
    return res.status(404).send("The order with the given ID was not found.");

  order.paymentMethodId = req.paymentMethodId;
  const hostUrl = getHostURL(req);

  const result = await p24.createTransaction(order, hostUrl);
  if (_.isError(result)) return res.status(400).send(result);

  res.send(result); //TODO: redirect
});

router.get("/:id/status", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order.status);
});

router.post("/:id/p24Callback", validateObjectId, async (req, res) => {
  const verification = p24.verifyNotification(req.body);
  if (!verification) return res.status(400).send("Incorrect verification.");

  if (req.body.amount != req.body.originAmount)
    return res.status(400).send("The order is not paid in full.");

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      p24Id: req.body.orderId,
    },
    { new: true }
  );

  if (order.status === "interrupted")
    return res.status(400).send("Order is interrupted.");

  const result = await p24.verifyTransaction(order);

  if (_.isError(result))
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

const getProperties = (customer, cart, delivery, status) => {
  return {
    customer: customer,
    cart: cart,
    delivery: delivery,
    totalCost: cart.amount + delivery.cost,
    status: status,
  };
};

module.exports = router;
