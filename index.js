const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/prod")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/needful")();

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  winston.info(`Node environment: ${process.env.NODE_ENV}`);
  winston.info(`Listening on port ${port}...`);
});

const { Cart } = require("./models/cart");

setTimeout(async () => {
  const x = await Cart.findById("632cbd79232a7268e5f9b961")
    .select("-_id -createdAt -updatedAt -__v")
    .setOptions({});
  console.log(x);
}, 1);

module.exports = server;
