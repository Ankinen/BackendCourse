"use strict";

const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.index);
router.get("/chat", homeController.chat);
router.get("/contact", homeController.getSubscriptionPage);

module.exports = router;