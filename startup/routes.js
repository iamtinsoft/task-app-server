const express = require("express");
const user = require("../routes/user");
const auth = require("../routes/auth");
const task = require("../routes/task");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use("/api/task", task);
  app.use(error);
};
