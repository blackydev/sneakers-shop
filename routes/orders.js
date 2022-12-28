const express = require("express");
const _ = require("lodash");
const { Order, validate, orderStatuses } = require("../models/order");
const { Delivery } = require("../models/delivery");
const { Cart } = require("../models/cart");
const p24 = require("../utils/p24");
const { getHostURL } = require("../utils/url");
const {
  auth,
  unrequiredAuth,
  isAdmin,
} = require("../middleware/authorization");
const validateObjectId = require("../middleware/validateObjectId");
const { User } = require("../models/user");

const router = express.Router();

router.get("/", [auth, isAdmin], async (req, res) => {
  const { select, sortBy, status, pageLength, pageNumber } = req.query;

  if (status) {
    const tmp = orderStatuses.getByName(status);
    if (tmp)
      // status is a string like "paid"
      var findQuery = { status: tmp.code };
    else {
      // status is a number like 1
      const does = orderStatuses.doesExist(status);
      if (does) findQuery = { status: status };
    }
  }

  const orders = await Order.find(findQuery)
    .populate("delivery.method", "name")
    .select(select)
    .limit(pageLength)
    .skip(pageLength * pageNumber)
    .sort(sortBy);
  res.send(orders);
});

router.get("/:id", [validateObjectId, auth, isAdmin], async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("delivery.method", "name")
    .populate("cart.product", "name image release");

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

router.post("/", unrequiredAuth, async (req, res) => {
  /*
    headers: {
    token (unrequired)
    }
  request: 
  {
   cartId: `ref`, customer: {}, deliveryId: 'ref'
  }
  */

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const delivery = await Delivery.findById(req.body.deliveryId);
  if (!delivery)
    return res
      .status(400)
      .send("The delivery with the given ID was not found.");
  const cart = await Cart.findByIdAndRemove(req.body.cartId).select(
    "-createdAt -updatedAt -_id -__v"
  );
  if (!cart)
    return res.status(400).send("The cart with the given ID was not found.");

  const order = new Order({
    customer: getCustomerProps(req),
    cart: cart.items,
    delivery: {
      method: delivery._id,
      price: delivery.price,
    },
  });
  await order.save();

  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      user.orders.push(order);
      await user.save();
    }
  }
  res.send(order);
});

router.get("/:id/payment", validateObjectId, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  if (order.status < 0)
    return res
      .status(400)
      .send("The order with the given ID has been interrupted.");

  const hostUrl = getHostURL(req);

  const result = await p24.createTransaction(order, hostUrl);
  if (_.isError(result)) return res.status(400).send(result); // if server has died

  res.send(result);
});

router.put(
  "/:id/status",
  [validateObjectId, auth, isAdmin],
  async (req, res) => {
    /*
  request: 
    { status }
  */
    if (!orderStatuses.doesExist(req.body.status))
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
  ).populate("delivery.method");

  if (order.status < 0) return res.status(400).send("Order is interrupted.");

  let result = await p24.verifyTransaction(order);
  if (_.isError(result)) return res.status(400).send();

  order.status = "paid";
  await order.save();

  res.status(204);
});

function getCustomerProps(req) {
  return _.pick(req.body.customer, [
    "name",
    "email",
    "company",
    "address",
    "zip",
    "city",
    "phone",
  ]);
}

module.exports = router;
