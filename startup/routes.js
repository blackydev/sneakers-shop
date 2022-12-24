const express = require("express");
const config = require("config");
const users = require("../routes/users");
const auth = require("../routes/auth");
const products = require("../routes/products");
const orders = require("../routes/orders");
const carts = require("../routes/carts");
const deliveries = require("../routes/deliveries");
const categories = require("../routes/categories");

module.exports = function (app) {
  app.use("/api/public", express.static(config.get("public")));
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/products", products);
  app.use("/api/categories", categories);
  app.use("/api/carts", carts);
  app.use("/api/orders", orders);
  app.use("/api/deliveries", deliveries);
};
