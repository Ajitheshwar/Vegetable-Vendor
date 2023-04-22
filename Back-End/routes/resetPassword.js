const user = require("../controllers/loginuser");
const express = require("express");

var resetPasswordRouter = express.Router();

resetPasswordRouter.route("/").post(user.resetPassword);

module.exports = resetPasswordRouter;
