"use strict";

const express = require("express");
const app = express();
const router = express.Router();
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const expressValidator = require("express-validator");
const passport = require("passport");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

const User = require("./models/user");

// This lets mongoose know that we want to use native ES6 promises
mongoose.Promise = global.Promise;

//set up the connection to your database
mongoose.connect("mongodb://localhost:27017/recipe_db", {useNewUrlParser: true});

const db = mongoose.connection;

db.once("open", () => {
    console.log("Succesfully connected to MongoDB");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(layouts);
router.use(express.static("public"));
router.use(express.urlencoded({ extended: false }));
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
router.use(express.json());

router.use(cookieParser("secret_passcode"));
router.use(expressSession({
    secret: "secret_passcode", 
    cookie: {maxAge: 4000000},
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(connectFlash());

router.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});

router.use(expressValidator());
router.use(homeController.logRequestPaths);

router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);

router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);

router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/users/:id", usersController.show, usersController.showView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);

router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);

router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.get("/courses/:id", coursesController.show, coursesController.showView);

router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.logErrors);
router.use(errorController.resourceNotFound);
router.use(errorController.hasInternalError);

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${ app.get("port") }`);
});