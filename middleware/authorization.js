const { User } = require("../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    if (process.env.NODE_ENV !== "test") {
      const user = await User.findById(decoded._id);

      if (user.authNumber != decoded.authNumber) throw Error();
    }

    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
};
