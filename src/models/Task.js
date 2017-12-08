const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Task = new Schema({
  description: String,
  complete: Boolean
});

Task.methods.toggleComplete = function(){
  if (this.complete === true){
    this.complete = false;
  } else {
    this.complete = true;
  }
  
};

Task.methods.updateDescription = function(newDescription){
  this.description = newDescription;
};
//Define our model.
// http://mongoosejs.com/docs/models.html
module.exports = mongoose.model('Task', Task);
