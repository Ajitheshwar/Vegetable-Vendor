const adminRouter = require("express").Router()
const adminDashboardRouter = require("./adminDashboard")
const adminOrdersRouter = require("./adminOrders")
const adminProductsRouter = require("./adminProducts")
const adminCustomersRouter = require("./adminCustomers")
const adminSupplierRouter = require("./adminSupplier")
const {getCategoriesAndSubCategories} = require("../../controllers/user/products") 
const verifyToken = require("../../controllers/tokenVerify")
const { getMessages, addMessage } = require("../../controllers/user/users")
const { getNotificationsAdmin, removeAdminNotification } = require("../../controllers/admin/adminDashboard")

adminRouter.use(verifyToken)

adminRouter.get("/",(req,res)=>{res.send({message : "Verified"})})

adminRouter.get("/categoriesAndSubCategories",getCategoriesAndSubCategories)

adminRouter.use("/adminDashboard",adminDashboardRouter)

adminRouter.use("/orders",adminOrdersRouter)

adminRouter.use("/products",adminProductsRouter)

adminRouter.use("/customers",adminCustomersRouter)

adminRouter.use("/suppliers",adminSupplierRouter)

adminRouter.get("/getNotifications",getNotificationsAdmin)

adminRouter.post("/sendMessage", addMessage);

adminRouter.get("/getMessages/:email",getMessages)

adminRouter.post("/removeNotificaition/:id",removeAdminNotification)

module.exports = adminRouter