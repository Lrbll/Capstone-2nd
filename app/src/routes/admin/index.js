"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./admin.ctrl");

router.get("/", ctrl.output.admin);
router.get("/management/user", ctrl.output.user);
router.get("/management/request", ctrl.output.analysis);
router.get("/login", ctrl.output.adminLogin);

router.post("/deleteUser", ctrl.process.deleteUser);
router.post("/login", ctrl.process.login);

module.exports = router;
