const adminOrdersRouter = require("express").Router()
const adminOrder = require("../../controllers/admin/adminOrderController");


adminOrdersRouter.get("/allOrders", adminOrder.getOrders);

adminOrdersRouter.get("/todayProducts", adminOrder.dashboard);

adminOrdersRouter.get("/weeklyCompare/:p1/:p2", adminOrder.weeklyCompare);

adminOrdersRouter.get('/todayOrdersInfo',adminOrder.todaysInfo)

adminOrdersRouter.put('/updateStatus/:oid',adminOrder.updateStatus)

module.exports = adminOrdersRouter
