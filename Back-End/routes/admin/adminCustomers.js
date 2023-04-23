const adminCustomersRouter = require("express").Router()
const {displayCustomers, singleCustomer, orderDetails} = require("../../controllers/admin/customersDisplay");

adminCustomersRouter.get("/",displayCustomers)

adminCustomersRouter.get("/customer-order/:id", orderDetails)

adminCustomersRouter.get("/single-customer/:id",singleCustomer)

module.exports = adminCustomersRouter