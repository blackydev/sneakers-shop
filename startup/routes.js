const express = require("express");
const users = require("../routes/users");
const authentication = require("../routes/authentication");
const products = require("../routes/products");
const orders = require("../routes/orders");
const error = require("../middleware/error");
const config = require("config");

module.exports = function (app) {
  app.use(express.json());

  app.use("/public", express.static(config.get("public")));
  app.use("/api/users", users);
  app.use("/api/products", products);
  app.use("/api/orders", orders);
  app.use("/api/auth", authentication);

  app.use(error);
};
