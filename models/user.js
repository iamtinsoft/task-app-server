const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  createdAt: String,
  lastLogin: String,
  isActive: Boolean,
  isEmailVerified: Boolean,
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin,
      isActive: this.isActive,
      isEmailVerified: this.isEmailVerified,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.bool().required(),
  };
  return Joi.validate(user, schema);
}
function validateUserUpdate(user) {
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
  };
  return Joi.validate(user, schema);
}
function validateUserPasswordUpdate(user) {
  const schema = {
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}
exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
exports.validateUpdate = validateUserUpdate;
exports.validatePasswordUpdate = validateUserPasswordUpdate;
