"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./admin.ctrl");

router.get("/", ctrl.output.admin);
router.get("/login", ctrl.output.adminLogin);
router.get("/show/userList", ctrl.output.userList);
router.get("/show/requestList", ctrl.output.requestList);
router.get("/show/userInfo/:user", ctrl.output.userInfo);

router.post("/deleteUser", ctrl.process.deleteUser);
router.post("/login", ctrl.process.login);

module.exports = router;
