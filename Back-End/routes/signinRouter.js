const user = require("../controllers/loginuser");
const express = require("express");

var signup_router = express.Router();

signup_router.route("/").post(user.signup_user);

module.exports = signup_router;
