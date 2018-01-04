const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  description: String,
  complete: Boolean
});

TaskSchema.methods.toggleComplete = function(){
  if (this.complete === true){
    this.complete = false;
  } else {
    this.complete = true;
  }
};

TaskSchema.methods.updateDescription = function(newDescription){
  this.description = newDescription;
};

module.exports = TaskSchema;
