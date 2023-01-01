const { User } = require("../../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const getAuthToken = async (isAdmin) => {
  return jwt.sign(
    {
      _id: mongoose.Types.ObjectId(),
      isAdmin,
    },
    config.get("jwtPrivateKey")
  );
};

const deleteUsers = async () => {
  await User.deleteMany({});
};

module.exports = {
  getAuthToken,
  deleteUsers,
};
