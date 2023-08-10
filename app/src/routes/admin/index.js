"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./admin.ctrl");

router.get("/", ctrl.output.admin);
router.get("/login", ctrl.output.adminLogin);

router.post("/login", ctrl.process.login);

module.exports = router;
