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
  async function(username, password, done){
    console.log("Attempting to add a new user.");
    const existingUser = await User.findOne({username});

    if (existingUser !== null){
      console.error(`User already exists by the username ${username}.`)
      return done(null, false);
    }

    const newUser = new User({ username });
    newUser.password = await newUser.generateHash(password);

    try{
      await newUser.save();
      console.log("New User Saved");
      return done (null, newUser)
    } catch (e){
      throw e;
    }
  }
));

passport.use("local-login", new LocalStrategy(
  async function(username, password, done){
    console.log(`Attempting to log in user with the name ${username}`);
    try{
      const user = await User.findOne({username});
      if (user === null){
        console.log("User does not exist");
        return done(null, false);
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword){
        console.log("Invalid password submission");
        return done(null, false);
      }

      console.log(`User & Password valid, logging in ${username}`);
      return done(null, user)
    } catch (e){
      console.log("An error occured during login.")
      return done(e);
    }

  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

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
app.listen(3000, () => console.log('App Running'));
