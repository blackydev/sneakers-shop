const express = require("express");
const router = express.Router();
const { getPaymentMethods } = require("../controllers/p24");
const validateObjectId = require("../middleware/validateObjectId");
const { Order, paymentTimeLimit } = require("../models/order");
const { recreateReturnedCart } = require("../controllers/orders/carts");
const { setInterruptedOrder } = require("../controllers/orders");
const p24 = require("../controllers/p24");
const { getHostURL } = require("../utils/url");
const _ = require("lodash");

router.get("/methods/", async (req, res) => {
  const result = await getPaymentMethods("pl");
  res.status(200).send(result);
});

router.get("/methods/:lang", async (req, res) => {
  const result = await getPaymentMethods(req.params.lang);
  res.status(200).send(result);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
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

router.post("/callback/:id", validateObjectId, async (req, res) => {
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

module.exports = router;
