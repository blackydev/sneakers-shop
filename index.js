const winston = require("winston");
const express = require("express");
const app = express();

require("./startup")(app);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  winston.info(`Node environment: ${process.env.NODE_ENV}`);
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
