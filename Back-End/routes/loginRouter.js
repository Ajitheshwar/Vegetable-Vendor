const user = require("../controllers/loginuser");
const express = require("express");
var login_router = express.Router();

login_router.route("/").get(user.display_login_page).post(user.login_user);

module.exports = login_router;
