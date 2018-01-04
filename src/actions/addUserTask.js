
const User = require("../controllers/User");
const Task = require("../controllers/Task");
const createUserTask = require("./createNewTask");
// Adds a task to a specific user
module.exports = function(userId, taskDescription){

  User.findOne({_id: userId})
    .then(user =>{
      if (!user){
        return false;
      } else {
        // const newTask = new Task({
        //   description: taskDescription,
        //   complete: false
        // });
        const newTask = createUserTask(taskDescription);
        user.tasks.push(newTask);
        user.save(function(error){
          if (error) return error;
          console.log("Task added");
        });
      }
    });
};
