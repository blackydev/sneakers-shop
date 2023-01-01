const helmet = require("helmet");
const compression = require("compression");
const config = require("config");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
};
