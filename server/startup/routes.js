const express = require("express");
const users = require("../routes/users");
const products = require("../routes/products");
const orders = require("../routes/orders");
const p24 = require("../routes/p24");
const deliveries = require("../routes/deliveries");
const furgonetka = require("../routes/furgonetka");
const error = require("../middleware/error");
const config = require("config");

module.exports = function (app) {
  app.use(express.json());

  app.use("/public", express.static(config.get("public")));
  app.use("/api/users/", users);
  app.use("/api/products", products);
  app.use("/api/orders", orders);
  app.use("/api/p24", p24);
  app.use("/api/deliveries", deliveries);
  app.use("/api/furgonetka", furgonetka);

  app.use(error);
};
