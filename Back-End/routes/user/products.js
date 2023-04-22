const userProductsRoute = require("express").Router()
const productsController = require("../../controllers/user/products");

userProductsRoute.get("/getCategoriesAndSubCategories", productsController.getCategoriesAndSubCategories);

userProductsRoute.get("/getProducts/search/:search/:page",productsController.getProductsBySearch)

userProductsRoute.get("/getProducts/subCategories/:listOfFilters/:page",productsController.getProductsByFilter)

userProductsRoute.get("/getProducts/category/:category/:page",productsController.getProductsByCategory)

module.exports = userProductsRoute