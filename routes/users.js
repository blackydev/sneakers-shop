const bcrypt = require("bcrypt");
const express = require("express");
const _ = require("lodash");
const { User, validate, validateAuth } = require("../models/user");
const { auth } = require("../middleware/authorization");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["email", "password"]));
  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

router.post("/auth", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

router.get("/orders", auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "orders",
    select: "customer cart status delivery",
    populate: [
      {
        path: "cart.product",
        select: "name image release",
      },
      { path: "delivery.method", select: "name" },
    ],
  });
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user.orders);
});

module.exports = router;
