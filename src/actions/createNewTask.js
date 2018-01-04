const Task = require("../controllers/Task");

module.exports = function(taskDescription){
  return new Task({
    description: taskDescription,
    complete: false
  });
};
