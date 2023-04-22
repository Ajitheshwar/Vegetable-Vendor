const express = require("express");
const adminDashboardRouter = express.Router();
const adminDashboard = require("../../controllers/admin/adminDashboard");

adminDashboardRouter.get("/", adminDashboard.getTotalData);

adminDashboardRouter.get(
  "/category/:category",
  adminDashboard.getDashboardOfCategory
);

adminDashboardRouter.get(
  "/month/:month",
  adminDashboard.getDashboardDetails
);

adminDashboardRouter.get(
  "/singleProduct/:product/:month",
  adminDashboard.getAdminDashboardSingleProduct
);

adminDashboardRouter.get(
  "/singleProductDetails/:product",
  adminDashboard.getSingleProductPresentDetails
);


module.exports = adminDashboardRouter;
