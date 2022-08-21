const sha384 = require("crypto-js/sha384");

exports.calculateSHA384 = (data) => {
  return sha384(data);
};
