const express = require("express");
const _ = require("lodash");
const { validate } = require("../models/order");
const router = express.Router();
const { Order, statuses } = require("../models/order");
const { Delivery } = require("../models/delivery");
const p24 = require("../controllers/p24");
const { getHostURL } = require("../utils/url");
const { auth, isAdmin } = require("../middleware/authorization");
const validateObjectId = require("../middleware/validateObjectId");
const { createDelivery } = require("../controllers/furgonetka");
const { Cart } = require("../models/cart");
const { isLength } = require("lodash");

router.get("/", [auth, isAdmin], async (req, res) => {
  const { select, sortBy, statusLike, pageLength, pageNumber } = req.query;

  if (statusLike) var findQuery = { status: statusLike };

  const orders = await Order.find(findQuery)
    .populate("delivery.method", "name")
    .select(select)
    .limit(pageLength)
    .skip(pageLength * pageNumber)
    .sort(sortBy);
  res.send(orders);
});

router.get("/:id", [auth, isAdmin], async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "delivery.method",
    "name"
  );

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

router.post("/", async (req, res) => {
  /*
request: 
{
  cart: `ref`, customer: {}, delivery: {method, ?point}}
}
  */
  const body = req.body;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  // GET DELIVERY PROPS
  let delivery = await Delivery.findById(body.delivery.method);

  if (!delivery)
    return res
      .status(404)
      .send("The delivery with the given ID was not found.");

  // GET CART
  const cart = await Cart.findByIdAndRemove(body.cart).select(
    "-createdAt -updatedAt -_id -__v"
  );

  if (!cart)
    return res.status(404).send("The cart with the given ID was not found.");

  const order = new Order({
    customer: getCustomerProps(body.customer),
    cart: cart,
    delivery: {
      method: delivery._id,
      cost: delivery.price,
      point: body.delivery.point,
    },
  });

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

  order.paymentMethodId = req.body.paymentMethodId;
  order.totalCost = await order.getTotalCost();
  const hostUrl = getHostURL(req);

  const result = await p24.createTransaction(order, hostUrl);
  if (_.isError(result)) return res.status(400).send(result);

  res.redirect(result);
});

router.get("/:id/status", validateObjectId, async (req, res) => {
  let order = await Order.findById(req.params.id).populate(
    "delivery.method",
    "name"
  );

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  const statuses = ["paid", "accepted", "shipped"];
  if (statuses.includes(order.status)) var customer = order.customer;

  res.send({
    status: order.status,
    customer: customer,
    cart: order.cart,
    delivery: order.delivery,
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
  ).populate("delivery.method", "serviceId");

  if (order.status === "interrupted")
    return res.status(400).send("Order is interrupted.");

  if (order.delivery.method.serviceId) {
    result = await createDelivery(order);
    if (_.isError(result)) return res.status(400).send();
    order.delivery.packageId = result.package_id;
  }

  let result = await p24.verifyTransaction(order);
  if (_.isError(result)) return res.status(400).send();

  order.status = "paid";

  res.status(204);
});

function getCustomerProps(customerBody) {
  return _.pick(customerBody, [
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
