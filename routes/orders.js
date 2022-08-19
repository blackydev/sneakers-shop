<<<<<<< Updated upstream
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
=======
const { Order, validate } = require("../models/order");
const { createCustomer } = require("../controllers/customers");
const { createCart } = require("../controllers/carts");
const mongoose = require("mongoose");
>>>>>>> Stashed changes
const router = express.Router();
const orderController = require("../controllers/orders");

<<<<<<< Updated upstream
router.get("/", (req, res) => {
=======
router.get("/", async (req, res) => {
  const orders = await Order.find().sort("name");
  res.send(orders);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).send("The order with the given ID was not found.");

  res.send(order);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
>>>>>>> Stashed changes

});

router.post("/", orderController.post);

<<<<<<< Updated upstream
=======
  res.send(order);
});

>>>>>>> Stashed changes
module.exports = router;
