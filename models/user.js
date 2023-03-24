const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { schemas, joiSchemas } = require("../utils/schemaProps");

const userSchema = new mongoose.Schema({
  email: { ...schemas.email, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1024,
    trim: true,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: false,
    },
  ],

  isAdmin: {
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey"),
  );
};

const User = mongoose.model("users", userSchema);

const complexityOptions = {
  min: 10,
  max: 64,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 0,
};

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: passwordComplexity(complexityOptions).required(),
  });

  return schema.validate(user);
}

function validateAuth(user) {
  const schema = Joi.object({
    email: joiSchemas.email.required(),
    password: passwordComplexity(complexityOptions),
  });

  return schema.validate(user);
}

module.exports = {
  User,
  validate: validateUser,
  validateAuth,
  userSchema,
};
