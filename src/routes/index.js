const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
// Main Index Route
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/tasks", (req, res) => {
  Task.find()
    .then((tasks) => {

      console.log(tasks);
      res.json(tasks);
    });
});

router.post("/tasks/add", (req, res) => {
  console.log(req.body);
  const newTask = new Task({
    description: req.body.description,
    complete: false
  });

  newTask.save()
    .then(() => {
      Task.find()
        .then((tasks) => {
          res.json(tasks);
        });
    });
});

router.get("/tasks/complete/:taskId", (req, res) => {
  Task.findOne({_id: req.params.taskId})
    .then(task => {
      task.toggleComplete();
      task.save()
        .then(()=>{
          console.log(task);
          res.json(task);
        })
        .catch(e => {
          throw e;
        });
    })
    .catch(e => {
      throw e;
    });
});

router.get("/tasks/delete/:taskId", (req, res) => {
  Task.remove({_id: req.params.taskId})
    .then(()=>{
      Task.find()
        .then(remainingTasks =>{
          res.json(remainingTasks);
        })
        .catch(e => {
          throw e;
        });
    });
});

router.put("/tasks/edit/:taskId", (req, res) => {
  Task.findOneAndUpdate({_id: req.params.taskId}, {$set: {description: req.body.description}})
    .then(()=>{
      Task.find()
        .then(remainingTasks =>{
          res.json(remainingTasks);
        })
        .catch(e => {
          throw e;
        });
    });
});
module.exports = router;
