const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  taskDescription: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 500,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  createdAt: String,
  status: {
    type: Number,
    required: true,
  },
});
const Task = mongoose.model("Task", taskSchema);
function validateTask(task) {
  const schema = {
    taskName: Joi.string().min(2).max(50).required(),
    taskDescription: Joi.string().min(2).max(500).required(),
    startTime: Joi.string().min(5).max(255).required(),
    endTime: Joi.string().min(5).max(255).required(),
    status: Joi.number().required(),
  };
  return Joi.validate(task, schema);
}
exports.taskSchema = taskSchema;
exports.Task = Task;
exports.validate = validateTask;
