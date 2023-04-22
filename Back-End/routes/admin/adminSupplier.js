const adminSupplierRouter = require("express").Router();
const supplier = require("../../controllers/admin/supplierC");

adminSupplierRouter.route("/").get(supplier.getDetails).post(supplier.addSupplier);

adminSupplierRouter.route("/:id").get(supplier.getAsupplier);

module.exports = adminSupplierRouter;
