const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    const user = await User.findOne({
      _id: decoded._id,
      authNumber: decoded.authNumber,
    });
    if (!user) throw Error();

    req.user = user;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
}

function isAdmin(req, res, next) {
  return req.user.isAdmin ? next() : res.status(403).send("Access denied");
}

module.exports = {
  auth,
  isAdmin,
};
