const express = require("express");
const router = express.Router();
const { Delivery, validate } = require("../models/delivery");
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const methods = await Delivery.find();
  res.status(200).send(methods);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const method = await Delivery.findById(req.params.id);

  if (!method)
    return res.status(404).send("The method with the given ID was not found.");

  res.send(method);
});

router.put("/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
  if (!req.body.points) req.body.points = false;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    getProperties(req.body),
    { new: true }
  );

  if (!delivery)
    return res
      .status(404)
      .send("The delivery method with the given name was not found.");

  res.send(delivery);
});

const getProperties = (body) => {
  return _.pick(body, ["name", "price", "points", "serviceId"]);
};

module.exports = router;
