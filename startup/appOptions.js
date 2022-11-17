const express = require("express");
const config = require("config");
const cors = require("cors");
const error = require("../middleware/error");

const corsConfig = {
  origin: config.get("clientUrl"),
  credentials: true,
};

module.exports = function (app) {
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(error);
};
