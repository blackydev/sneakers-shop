const express = require("express");
const router = express.Router();
const { Delivery } = require("../../models/order/delivery");
const { getDeliverers, getPoints } = require("../../controllers/furgonetka");
const validateObjectId = require("../../middleware/validateObjectId");
const { auth, isAdmin } = require("../../middleware/authorization");

router.get("/", async (req, res) => {
  const methods = await Delivery.find();
  res.status(200).send(methods);
});

router.patch("/:id", validateObjectId, async (req, res) => {
  if (req.body.price)
    if (error) return res.status(400).send("Price needed to patch.");

  const method = await Delivery.findByIdAndUpdate(
    req.params.id,
    { price: req.body.price },
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
