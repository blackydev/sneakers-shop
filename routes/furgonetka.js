const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  getPoints,
  getDeliverers,
  createDelivery,
} = require("../controllers/furgonetka");
const { Order } = require("../models/order");
const { auth, isAdmin } = require("../middleware/authorization");

router.get("/", async (req, res) => {
  const result = await getDeliverers();
  res.status(200).send(result);
});

router.post("/delivery", [auth, isAdmin], async (req, res) => {
  /* 
correct request: 
{
  orderId, deliveryId, serviceId, packages
}
*/

  const order = await Order.findById(req.body.orderId);
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  const deliveryMethod = await Delivery.findById(req.body.deliveryId);
  if (!deliveryMethod)
    return res
      .status(404)
      .send("The delivery method with the given ID was not found.");

  const { pickup, packages } = req.body;

  const result = await createDelivery(
    pickup,
    order,
    deliveryMethod.serviceId,
    packages
  );
  if (_.isError(result)) return result.status(400).send(result.message);

  await Order.findByIdAndUpdate(req.body.orderId, { status: "in delivery" });

  res.status(200).send(result); // todo: change result
});

router.get("/:service/points", async (req, res) => {
  /*
  request: /inpost/points/?search=miami
  */
  const { search } = req.query;
  const service = req.params.service;
  if (!search) return res.status(400).send("No search phrase query.");
  const data = await getPoints(service, search);
  res.status(200).send(data);
});

module.exports = router;
