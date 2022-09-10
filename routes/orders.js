const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Order, statuses } = require("../models/order");
const { createOrder } = require("../controllers/orders");
const p24 = require("../controllers/p24");
const { getHostURL } = require("../utils/url");
const { auth, isAdmin } = require("../middleware/authorization");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", [auth, isAdmin], async (req, res) => {
  const { select, sortBy, statusLike, pageLength, pageNumber } = req.query;

  if (statusLike) var findQuery = { status: statusLike };

  const orders = await Order.find(findQuery)
    .select(select)
    .limit(pageLength)
    .skip(pageLength * pageNumber)
    .sort(sortBy);

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
  cart: {...}, customer: {...}, delivery: {methodId, ?point}
}
  */
  req.body.status = "pending";
  const orderObject = await createOrder(req.body);
  if (_.isError(orderObject)) return res.status(400).send(orderObject.message);

  const order = new Order(orderObject);
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

  res.redirect(result); //TODO: redirect
});

router.get("/:id/status", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  const statuses = ["paid", "accepted", "shipped"];
  if (statuses.includes(order.status)) var customer = order.customer;

  res.send({
    status: order.status,
    customer: customer,
    cart: order.cart,
    delivery: {
      name: order.delivery.name,
      cost: order.delivery.cost,
      point: order.delivery.point,
    },
    totalCost: order.totalCost,
  });
});

router.put(
  "/:id/status",
  [validateObjectId, auth, isAdmin],
  async (req, res) => {
    /*
  request: 
    { status }
  */
    if (!statuses.includes(req.body.status))
      return res.status(400).send("Invalid status.");

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );
    if (!order)
      return res.status(404).send("The order with the given ID was not found.");

    res.send(order);
  }
);

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

module.exports = router;
