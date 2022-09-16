const config = require("config");
const p24 = require("../controllers/p24");

module.exports = async function async() {
  if (!config.has("jwtPrivateKey"))
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");

  if (!config.has("db")) throw new Error("FATAL ERROR: db is not defined.");

  if (!config.has("p24.crc"))
    throw new Error("FATAL ERROR: crc  is not defined.");

  // TODO: UPDATE ONCIFG REQUIREMENTS
  if (process.env.NODE_ENV === "production")
    if ((await p24.test()) !== true)
      throw new Error(
        "FATAL ERROR: Unsuccessful test connection with przelewy24."
      );
};
