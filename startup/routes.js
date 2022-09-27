const express = require("express");
const users = require("../routes/users");
const products = require("../routes/products");
const orders = require("../routes/orders");
const carts = require("../routes/carts");
const p24 = require("../routes/p24");
const deliveries = require("../routes/deliveries");
const error = require("../middleware/error");
const config = require("config");
const cors = require("cors");

const corsConfig = {
  origin: config.get("clientUrl"),
  credentials: true,
};

module.exports = function (app) {
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use("/api/public", express.static(config.get("public")));
  app.use("/api/users", users);
  app.use("/api/products", products);
  app.use("/api/carts", carts);
  app.use("/api/orders", orders);
  app.use("/api/p24", p24);
  app.use("/api/deliveries", deliveries);

  app.use(error);
};
