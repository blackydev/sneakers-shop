const crypto = require("crypto");

exports.calculateSHA384 = (data) => {
  return crypto.createHash("sha384").update(data, "utf8").digest("hex");
};
