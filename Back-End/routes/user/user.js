const express = require("express");
const userAPIRoute = express.Router();
const userDetailsRoute = require("./userDetails")
const userOrdersRoute = require("./orders")
const userProductsRoute = require("./products")
const verifyToken = require("../../controllers/tokenVerify")

userAPIRoute.use(verifyToken)

userAPIRoute.get("/",(req,res)=>{res.send({message : "Verified"})})

userAPIRoute.use("/details",userDetailsRoute)

userAPIRoute.use("/products",userProductsRoute)

userAPIRoute.use("/orders",userOrdersRoute)

module.exports = userAPIRoute;
