const express = require("express");
const router = express.Router();
const { Delivery, validate } = require("../models/delivery");
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");
const _ = require("lodash");

router.get("/", async (req, res) => {
  const deliveries = await Delivery.find();
  res.status(200).send(deliveries);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const delivery = await Delivery.findById(req.params.id);

  if (!delivery)
    return res
      .status(404)
      .send("The delivery with the given ID was not found.");

  res.send(delivery);
});

router.post("/", [auth, isAdmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const delivery = new Delivery(getProperties(req.body));
  await delivery.save();

  res.send(delivery);
});

router.put("/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
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
      .send("The delivery with the given ID was not found.");

  await delivery.save();

  res.send(delivery);
});

const getProperties = (body) => {
  return _.pick(body, ["name", "price"]);
};

module.exports = router;
