const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  User,
  validate,
  validateUpdate,
  validatePasswordUpdate,
} = require("../models/user");
const mongoose = require("mongoose");
const moment = require("moment");
const express = require("express");
//const { sendEmail } = require("../helpers/email");
const router = express.Router();

// Show all user
router.get("/", async (req, res) => {
  const user = await User.find().sort("createdAt");
  res.send(user);
});

// Show  user by ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

// Create Account
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Duplicate user Account Found.");
  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    createdAt: moment().toJSON(),
    lastLogin: moment().toJSON(),
    isActive: false,
    isEmailVerified: false,
    isAdmin: req.body.isAdmin,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

// Update Profile
router.put("/:id", async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let passeduser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  const user = await User.findByIdAndUpdate(req.params.id, passeduser, {
    new: true,
  });
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  // sendEmail(
  //   user.email,
  //   "Account Notification",
  //   "Your Password has been Changed Successfully"
  // );
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(token);
});

//Update Password

router.put("/update-password/:id", async (req, res) => {
  const { error } = validatePasswordUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Current Password");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(token);
});

//Update Avatar

// router.put("/update-avatar/:id", async (req, res) => {
//   let user = await user.findById(req.params.id);
//   if (!user)
//     return res.status(404).send("The user with the given ID was not found.");
//   user.userAvatar = req.body.avatar;
//   await user.save();
//   const token = user.generateAuthToken();
//   res
//     .header("x-auth-token", token)
//     .send(_.pick(user, ["_id", "email", "userAvatar"]));
// });

//Verify Email
router.put("/verify-email/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  user.isEmailVerified = req.body.verification;
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

//Account Access
router.put("/account-access/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  user.isActive = req.body.access;
  await user.save();
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "email"]));
});

//Delete Account
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
});

module.exports = router;
