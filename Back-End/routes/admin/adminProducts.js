const admin = require("../../controllers/admin/adminProductsc");
const adminProductsRouter = require("express").Router();

// adminProductsRouter
//   .route("/")
//   .get(admin.getAdminProduct)
//   .post(admin.addAdminProduct)
//   .put(admin.updateProduct);

adminProductsRouter.get("/", admin.getAdminProducts)

adminProductsRouter.put("/",admin.updateProduct)

adminProductsRouter.post("/",admin.addAdminProduct)

adminProductsRouter.post("/todayInfo",admin.updateTodayDetails)

adminProductsRouter.post("/imageUpload",admin.imageUpload);

module.exports = adminProductsRouter;
