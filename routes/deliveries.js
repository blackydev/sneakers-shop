const express = require("express");
const _ = require("lodash");
const { Delivery, validate } = require("../models/delivery");
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");

const router = express.Router();

router.get("/", async (req, res) => {
  const deliveries = await Delivery.find();
  res.send(deliveries);
});

router.post("/", [auth, isAdmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const delivery = new Delivery(getProperties(req));
  await delivery.save();

  res.send(delivery);
});

router.put("/:id", [validateObjectId, auth, isAdmin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const delivery = await Delivery.findByIdAndUpdate(
    req.params.id,
    getProperties(req),
    { new: true },
  );

  if (!delivery)
    return res
      .status(404)
      .send("The delivery with the given ID was not found.");

  res.send(delivery);
});

const getProperties = (req) => {
  return _.pick(req.body, ["name", "price"]);
};

module.exports = router;
