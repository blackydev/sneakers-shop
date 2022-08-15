const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const { schemas, joiSchemas } = require("./utils/schemas");

const authNumber = () => {
  const number = Math.floor(Math.random() * 9007199254740990);
  return this.authNumber = number.toString(36);
};

const userSchema = new mongoose.Schema({
  email: { ...schemas.email, required: true },
  password: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1024,
    trim: true,
  },
  authNumber: {
    type: String,
    default: authNumber(),
  },
  isAdmin: {
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, isAdmin: this.isAdmin, authNumber: this.authNumber },
    config.get("jwtPrivateKey")
  );
};


userSchema.methods.resetAuthNumber = authNumber;

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
    email: joiSchemas.email.required(),
    password: passwordComplexity(complexityOptions).required(),
    authDate: Joi.date(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

function validateAuth(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: passwordComplexity(complexityOptions),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
exports.validateAuth = validateAuth;
exports.userSchema = userSchema;
