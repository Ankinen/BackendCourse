"use strict";

const router = require("express").Router();
const errorController = require("../controllers/errorController");

router.use(errorController.logErrors);
router.use(errorController.resourceNotFound);
router.use(errorController.hasInternalError);

module.exports = router;