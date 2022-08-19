//Name of the file : sha384-hash.js
//Loading the crypto module in node.js
var crypto = require("crypto");
//creating hash object
var hash = crypto.createHash("sha384");
//passing the data to be hashed

exports.calculateSHA384 = (data) => {
  return crypto.createHash("sha384").update(data, "utf8").digest("hex");
};
