const _ = require("lodash");
const { Task, validate } = require("../models/task");
const mongoose = require("mongoose");
const moment = require("moment");
const express = require("express");
const router = express.Router();
// Show all task
router.get("/", async (req, res) => {
  const task = await Task.find().sort("createdAt");
  res.send(task);
});

// Show  task by ID
router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task)
    return res.status(404).send("The task with the given ID was not found.");
  res.send(task);
});

// Create Task
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let task = await Task.findOne({ taskName: req.body.taskName });
  if (task) return res.status(400).send("Duplicate Task Found.");
  task = new Task({
    taskName: req.body.taskName,
    taskDescription: req.body.taskDescription,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    createdAt: moment().toJSON(),
    status: req.body.status,
  });
  await task.save();
  res.send(_.pick(task, ["_id"]));
});

// Update Task
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let passedtask = {
    taskName: req.body.taskName,
    taskDescription: req.body.taskDescription,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    createdAt: moment().toJSON(),
    status: req.body.status,
  };
  const task = await Task.findByIdAndUpdate(req.params.id, passedtask, {
    new: true,
  });
  if (!task)
    return res.status(404).send("The task with the given ID was not found.");
  res.send(task);
});

//Delete Task
router.delete("/:id", async (req, res) => {
  const task = await Task.findByIdAndRemove(req.params.id);

  if (!task)
    return res.status(404).send("The task with the given ID was not found.");

  res.send(task);
});

module.exports = router;
