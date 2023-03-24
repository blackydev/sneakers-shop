const crypto = require("crypto");

exports.calculateSHA384 = (data) =>
  crypto
    .createHash("sha384")
    .update(JSON.stringify(data), "utf8")
    .digest("hex");
