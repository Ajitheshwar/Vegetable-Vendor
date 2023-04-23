const admin = require("../../controllers/admin/adminProductsc");
const adminProductsRouter = require("express").Router();

// adminProductsRouter
//   .route("/")
//   .get(admin.getAdminProduct)
//   .post(admin.addAdminProduct)
//   .put(admin.updateProduct);

adminProductsRouter.get("/", admin.getAdminProducts)

adminProductsRouter.put("/",admin.updateProduct)

adminProductsRouter.post("/addProduct",admin.addAdminProduct)

adminProductsRouter.put("/updateImage",admin.updateImage)

adminProductsRouter.post("/todayInfo",admin.updateTodayDetails)


module.exports = adminProductsRouter;
