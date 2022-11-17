const config = require("config");
const p24 = require("../utils/p24");

function checkConfig(properties) {
  properties.map((property) => {
    if (!config.has(property))
      throw new Error(`FATAL ERROR: ${property} is not defined.`);
  });
}

module.exports = async function async() {
  const properties = [
    "clientUrl",
    "jwtPrivateKey",
    "db",
    "public",
    "p24.merchantId",
    "p24.posId",
    "p24.raportKey",
    "p24.crc",
  ];
  checkConfig(properties);

  if (!process.env.offline) {
    const doesWork = await p24.test();
    if (!doesWork)
      throw new Error(
        "FATAL ERROR: Unsuccessful test connection with przelewy24."
      );
  }
};
