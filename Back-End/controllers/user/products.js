const Products = require("../../models/products").Products;
const PAGE_LIMIT = 8;

const getCategoriesAndSubCategories = async (req, res) => {
    try {
        let categories = await Products.distinct("category");

        let categoriesAndSubCategories = [];
        for (let category of categories) {
            let subCategories = await Products.distinct("subCategory", {
                category: category,
            });
            categoriesAndSubCategories.push({
                category: category,
                subCategories: subCategories,
            });
        }

        res.status(200).send(categoriesAndSubCategories);
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Categories and Sub Categories\nPlease refersh your page"
        );
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let category = req.params.category;
        if (category == "all") {
            Promise.all([
                Products.find({}, "name").countDocuments(),
                Products.find(
                    {},
                    "name sellingPrice category description subCategory benefits image"
                )
                    .skip((page - 1) * PAGE_LIMIT)
                    .limit(PAGE_LIMIT),
            ])
                .then((result) => {
                    res.status(200).send({
                        total_pages: Math.ceil(result[0] / PAGE_LIMIT),
                        data: result[1],
                    });
                })
                .catch((error) => {
                    throw new Error(
                        "Error in getting Category Filter Data",
                        error
                    );
                });
        } else {
            Promise.all([
                Products.find({ category: category }, "name").countDocuments(),
                Products.find(
                    { category: category },
                    "name sellingPrice category description subCategory benefits image"
                )
                    .skip((page - 1) * PAGE_LIMIT)
                    .limit(PAGE_LIMIT),
            ])
                .then((result) => {
                    res.status(200).send({
                        total_pages: Math.ceil(result[0] / PAGE_LIMIT),
                        data: result[1],
                    });
                })
                .catch((error) => {
                    throw new Error(
                        "Error in getting Category Filter Data",
                        error
                    );
                });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in getting Category Data\nPlease refresh your page"
        );
    }
    //console.log(result)
};

const getProductsByFilter = async (req, res) => {
    try {
        let subCategories = req.params.listOfFilters.split("+");

        let page = parseInt(req.params.page);

        //console.log(subCategories);
        Promise.all([
            Products.find(
                { subCategory: { $in: subCategories } },
                "name"
            ).countDocuments(),
            Products.find(
                { subCategory: { $in: subCategories } },
                "name sellingPrice category description subCategory benefits image"
            )
                .skip((page - 1) * PAGE_LIMIT)
                .limit(PAGE_LIMIT),
        ])
            .then((result) => {
                res.status(200).send({
                    total_pages: Math.ceil(result[0] / PAGE_LIMIT),
                    data: result[1],
                });
            })
            .catch((error) => {
                throw new Error("Error in applying filters", error);
            });
    } catch (error) {
        console.log(error);
        res.status(400).send(
            "Error in applying filtering\nPlease refersh your page"
        );
    }
};

const getProductsBySearch = async (req, res) => {
    try {
        let page = parseInt(req.params.page);
        let search = req.params.search;
        Promise.all([
            Products.find(
                { name: { $regex: search, $options: "i" } },
                "name"
            ).countDocuments(),
            Products.find(
                { name: { $regex: search, $options: "i" } },
                "name sellingPrice category description subCategory benefits image"
            )
                .skip((page - 1) * PAGE_LIMIT)
                .limit(PAGE_LIMIT),
        ])
            .then((result) => {
                res.status(200).send({
                    total_pages: Math.ceil(result[0] / PAGE_LIMIT),
                    data: result[1],
                });
            })
            .catch((error) => {
                throw new Error("Error in searching products ", error);
            });
    } catch (error) {
        console.log(error);
        res.status(400).send("Error in Searching Products\nRefresh Your Page");
    }
};

module.exports = {
    getProductsByFilter,
    getProductsByCategory,
    getProductsBySearch,
    getCategoriesAndSubCategories,
};
