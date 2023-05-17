const admin = require("../../controllers/admin/adminProductsc");
const adminProductsRouter = require("express").Router();
const productsController = require("../../controllers/user/products");

adminProductsRouter.get("/", admin.getAdminProducts)

adminProductsRouter.get("/getCategoriesAndSubCategories", productsController.getCategoriesAndSubCategories);

adminProductsRouter.get("/getProducts/search/:search/:page",productsController.getProductsBySearch)

adminProductsRouter.get("/getProducts/subCategories/:listOfFilters/:page",productsController.getProductsByFilter)

adminProductsRouter.get("/getProducts/category/:category/:page",productsController.getProductsByCategory)

adminProductsRouter.put("/",admin.updateProduct)

adminProductsRouter.post("/addProduct",admin.addAdminProduct)

adminProductsRouter.put("/updateImage",admin.updateImage)

adminProductsRouter.post("/todayInfo",admin.updateTodayDetails)


module.exports = adminProductsRouter;
