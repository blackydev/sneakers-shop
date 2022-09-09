const express = require("express");
const router = express.Router();
const { Delivery, validatePatch } = require("../models/delivery");
const validateObjectId = require("../middleware/validateObjectId");
const { auth, isAdmin } = require("../middleware/authorization");

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

router.patch("/:id", [auth, isAdmin, validateObjectId], async (req, res) => {
  const { error } = validatePatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const method = await Delivery.findByIdAndUpdate(
    req.params.id,
    {
      price: req.body.price,
      serviceId: req.body.serviceId,
    },
    {
      new: true,
    }
  );

  if (!method)
    return res
      .status(404)
      .send("The delivery method with the given name was not found.");

  res.send(method);
});

module.exports = router;
