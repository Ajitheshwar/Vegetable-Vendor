const adminOrdersRouter = require("express").Router()
const adminOrder = require("../../controllers/admin/adminOrderController");


adminOrdersRouter.route("/").get(adminOrder.hi);

adminOrdersRouter.get("/display", adminOrder.getOrders);

adminOrdersRouter.get("/dailyProduct", adminOrder.dashboard);

adminOrdersRouter.get("/weeklyCompare/:p1/:p2", adminOrder.weeklyCompare);

adminOrdersRouter.get('/todaysInfo',adminOrder.todaysInfo)

adminOrdersRouter.post('/changePending',adminOrder.changePending)

adminOrdersRouter.get('/updatePending/:oid',adminOrder.updatePending)

module.exports = adminOrdersRouter
