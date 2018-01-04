const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const TaskSchema = require("./taskSchema");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  tasks: [TaskSchema]
});

UserSchema.methods.generateHash = function(password){
  return bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};
module.exports = UserSchema;
