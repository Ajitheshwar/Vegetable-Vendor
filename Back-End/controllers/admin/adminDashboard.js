const Admin = require("../../models/admin");
const dailyDashboardModel = require("../../models/dailyDashboard");
const dailyEachProducts =
    require("../../models/daily-each-product").dailyEachProducts;
const Products = require("../../models/products").Products;

async function getDashboardDetails(req, res) {
    //console.log(req.params);
    try {
        let month = parseInt(req.params.month);
        let thisMonth = new Date(2023, month);
        let nextMonth = new Date(2023, month + 1);
        //console.log(thisMonth, nextMonth);
        dailyDashboardModel
            .find({
                date: { $gte: thisMonth, $lt: nextMonth },
            })
            .then((dailyDashboardOfMonth) => {
                res.send(dailyDashboardOfMonth);
            })
            .catch((error) => {
                throw new Error("Error in getting dashboard Details", error);
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Dashboard Details\nPlease refresh your page"
        );
    }
}

async function getDashboardOfCategory(req, res) {
    //console.log(req.params);
    try {
        let category = req.params.category;
        dailyEachProducts
            .aggregate([
                {
                    $match: {
                        category: category,
                    },
                },
                {
                    $group: {
                        _id: "$product",
                        profit: {
                            $sum: {
                                $multiply: [
                                    "$quantity",
                                    {
                                        $subtract: [
                                            "$sellingPrice",
                                            "$costPrice",
                                        ],
                                    },
                                ],
                            },
                        },
                        loss: {
                            $sum: { $multiply: ["$wasted", "$costPrice"] },
                        },
                        revenue: {
                            $sum: { $multiply: ["$sellingPrice", "$quantity"] },
                        },
                    },
                },
            ])
            .then((orders) => {
                res.status(200).send(orders);
            })
            .catch((error) => {
                throw new Error(
                    "Error in getting Dashboard of category",
                    error
                );
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Dashboard of selected Category\nPlease refresh your page"
        );
    }
}

async function getTotalData(req, res) {
    try {
        Admin.findOne({}, "totalLoss totalProfit totalRevenue notifications")
            .then((adminData) => {
                res.status(200).send(adminData);
            })
            .catch((error) => {
                throw new Error("Error in getting admin data", error);
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Admin Data\nPlease refresh your page"
        );
    }
}

async function getAdminDashboardSingleProduct(req, res) {
    //console.log(req.params)
    try {
        let thisMonth = new Date(2023, req.params.month);
        let prevMonth = new Date(2023, req.params.month - 1);
        dailyEachProducts
            .find({
                product: req.params.product,
                date: { $gte: prevMonth, $lt: thisMonth },
            })
            .then((productDetails) => {
                res.send(productDetails);
            })
            .catch((error) => {
                throw new Error(
                    "Error in getting Single Product Dashboard details",
                    error
                );
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Single Product Dashboard details\nPlease refresh your page"
        );
    }
}

async function getSingleProductPresentDetails(req, res) {
    //console.log(req.params);
    try {
        let result = await Products.findOne({ name: req.params.product });
        let date = new Date("2023-3-26");
        let today = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        let tomorrow = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
        );

        let wasted = await dailyEachProducts.findOne(
            {
                product: req.params.product,
                date: { $gte: today, $lt: tomorrow },
            },
            "wasted"
        );
        res.send({ data: result, wasted: wasted.wasted });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Present Details of selected Product\nPlease refersh your page"
        );
    }
}

const updateNotificationStatusAdmin = async (obj) => {
    let result = await Admin.updateOne(
        { email_address: "admin@gmail.com" },
        { $push: obj }
    );
    return "updated";
};

const getNotificationsAdmin = async (req, res) => {
    try {
        Admin.findOne({ email_address: "admin@gmail.com" }, "notifications")
            .then((result) => {
                res.send(result);
            })
            .catch((error) => {
                throw new Error("Error in getting notifications", error);
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Notifications\nPlease refresh your page"
        );
    }
};

const removeAdminNotification = async (req, res) => {
    let id = req.params.id;
    try {
        await Admin.updateOne(
            { email_address: "admin@gmail.com" },
            { $pull: { notifications: { id } } }
        )
            .then((result) => {
                res.send("Notification removed");
            })
            .catch((error) => {
                throw new Error("Error in updating notifications", error);
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in updating Notification\nPlease refresh your page"
        );
    }
};

module.exports = {
    getDashboardDetails,
    getDashboardOfCategory,
    getTotalData,
    getAdminDashboardSingleProduct,
    getSingleProductPresentDetails,
    updateNotificationStatusAdmin,
    getNotificationsAdmin,
    removeAdminNotification,
};
