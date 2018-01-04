// Basic Dependancies & App Initialization
const path = require("path");
const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
mongoose.Promise = Promise;
const app = express();

// Setting view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'/views'));
console.log(path.join(__dirname,'views'))

// Set middlewares
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(session({
  secret: "getshitdone",
  resave: false,
  saveUninitialized: true
}));


const User = require("./controllers/User");
passport.use("local-signup", new LocalStrategy(
  function(username, password, done){
    console.log("Attempting to add user");
    User.findOne({username})
      .then(async (error, user) => {
        console.log(`User found by ${username}:: ${user}`);
        if (error){
          console.log("Error happened");
          return done(error);
        }
        if (user){
          console.log("User Exists");
          return done (null, false);
        }else{
          const newUser = new User({
            username
          });
          newUser.password = await newUser.generateHash(password);
          newUser.save(function(err){
            if (err) throw err;
            console.log("User saved");
            return done(null, newUser);
          });
        }
      })
      .catch(e => {
        throw e;
      });
  }
));

passport.use("local-login", new LocalStrategy(
  function(username, password, done){
    console.log("Running login");
    User.findOne({username})
      .then(async (user) => {
        if (!user){
          return done(null, false);
        }else{
          const validPassword = await user.validatePassword(password);
          if (validPassword){
            return done(null, user);
          } else{
            return done(null, false);
          }
        }
      })
      .catch(e => {
        return done(e);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());


const mongooseOptions = {
  useMongoClient: true
};

// console.log(models("Task").schema);
mongoose.connect("mongodb://localhost/todo", mongooseOptions);

// Set Routes
const index = require(path.join(__dirname, '/routes/index'));
app.use("/", index);

// Set Error Handling (Should be done after all routes are defined)
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  console.log(err);
  res.status(err.status || 500);
  res.send(err.status);
});

// Start the Server
app.listen(3000, () => console.log('Example app listening on port 3000!'));
