const userOrdersRoute = require("express").Router()
const orderController = require("../../controllers/user/order");

userOrdersRoute.get("/getOrders",orderController.displayOrders)

userOrdersRoute.post("/addOrders", orderController.addOrders);

module.exports = userOrdersRoute