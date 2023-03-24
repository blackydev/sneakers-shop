const config = require("config");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
  return next();
}

async function unrequiredAuth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
  return next();
}

function isAdmin(req, res, next) {
  return req.user.isAdmin ? next() : res.status(403).send("Access denied");
}

module.exports = {
  auth,
  unrequiredAuth,
  isAdmin,
};
