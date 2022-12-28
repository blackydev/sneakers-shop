const error = require("../middleware/error");

module.exports = (app) => {
  app.use(error);
  require("./routes")(app);
  require("./prod")(app);
  require("./db")();
  require("./logging")();
  require("./config")();
  require("./validation")();
  require("./intervalProcesses")();
};
