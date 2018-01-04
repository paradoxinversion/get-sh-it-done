const mongoose = require("mongoose");
const TaskSchema = require("./taskSchema");

module.exports = mongoose.model('Task', TaskSchema);
