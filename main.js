"use strict";

const express = require("express");
const app = express();
const router = express.Router();
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Recipe = require("./models/recipe");
const methodOverride = require("method-override");

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

app.use("/", router);

router.use(layouts);
router.use(express.static("public"));
router.use(express.urlencoded({ extended: false }));
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
router.use(express.json());
router.use(homeController.logRequestPaths);

router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);

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

router.post("/subscribe", subscribersController.saveSubscriber);

router.use(errorController.logErrors);
router.use(errorController.resourceNotFound);
router.use(errorController.hasInternalError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${ app.get("port") }`);
});