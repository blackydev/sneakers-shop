const config = require("config");
const p24 = require("../controllers/payment/p24");

module.exports = async function async() {
  if (!config.has("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");

  if (!config.has("db")) throw new Error("FATAL ERROR: db is not defined.");

  if (!config.has("p24.crc"))
    throw new Error("FATAL ERROR: crc  is not defined.");

  if ((await p24.test()) !== true)
    throw new Error(
      "FATAL ERROR: Unsuccessful test connection with przelewy24."
    );
};
