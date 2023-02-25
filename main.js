"use strict";

const express = require("express");
const app = express();
const router = require("./routes/index");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const expressValidator = require("express-validator");
const passport = require("passport");

const User = require("./models/user");

// This lets mongoose know that we want to use native ES6 promises
mongoose.Promise = global.Promise;

//set up the connection to your database
mongoose.connect("mongodb://localhost:27017/recipe_db", {useNewUrlParser: true});
//mongoose.connect('mongodb://127.0.0.1:27017/meal2u

const db = mongoose.connection;

db.once("open", () => {
    console.log("Succesfully connected to MongoDB");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(layouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(express.json());

app.use(cookieParser("secret_passcode"));
app.use(expressSession({
    secret: "secret_passcode", 
    cookie: {maxAge: 4000000},
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(connectFlash());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});

app.use(expressValidator());

app.use("/", router);

const server = app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${ app.get("port") }`);
});
const io = require("socket.io")(server);
require("./controllers/chatController")(io);