const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../controllers/User");
const passport = require("passport");
// Main Index Route
router.get("/", (req, res) => {
  // console.log("Authenticated Status::", req.isAuthenticated());
  // if (req.isAuthenticated()){
  //   User.findOne({_id:req.session.user})
  //     .then(user => {
  //       res.render("index", {user});
  //     });
  //
  // }else{
  //   res.render("index");
  // }

  res.render("index");
});

router.get("/tasks", (req, res) => {
  if (!req.session.passport){
    Task.find()
      .then((tasks) => {
        res.json(tasks);
      });
  } else{
    res.redirect(`/${req.session.passport.user}/tasks`);
  }

});

router.get("/:userId/tasks", (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      res.send(user.tasks);
    });
});

router.post("/tasks/add", (req, res) => {
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


router.get("/:userId/tasks/add", (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      user.tasks.push({description: req.body.description, complete: false});
      user.save()
        .then(()=>{
          res.json(user.tasks);
        });

    });
});
router.get("/tasks/complete/:taskId", (req, res) => {
  Task.findOne({_id: req.params.taskId})
    .then(task => {
      task.toggleComplete();
      task.save()
        .then(()=>{
          // res.json(task);
          return Task.find()
            .then(tasks => {
              res.json(tasks);
            })
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


router.post("/sign-up", passport.authenticate("local-signup"), function(req, res){
  res.send("woot");
});

router.get("/sign-up", (req, res) => {
  res.redirect("/");
});

router.post("/sign-in", passport.authenticate("local-login"), (req, res) => {
  const userData = {
    userId: req.session.passport.user
  };
  res.send(userData);
});

router.get("/sign-in", (req, res) => {
  res.redirect("/");
});
module.exports = router;
