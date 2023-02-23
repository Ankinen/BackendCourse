"use strict";

const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.index);
router.get("/contact", homeController.getSubscriptionPage);

router.use(homeController.logRequestPaths);

module.exports = router;