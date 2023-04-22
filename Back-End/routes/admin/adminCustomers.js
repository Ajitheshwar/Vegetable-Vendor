const adminCustomersRouter = require("express").Router()
const {displayCustomers} = require("../../controllers/admin/customersDisplay");

adminCustomersRouter.get("/",displayCustomers)

module.exports = adminCustomersRouter