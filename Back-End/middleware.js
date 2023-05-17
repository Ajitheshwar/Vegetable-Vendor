const { Products } = require("./models/products");

const updatestock = async function () {
    try {
        let products = await Products.find({})
        let productDetails = [];

        products.forEach(async (obj) => {
            let singleProduct = {};
            let details = obj;
            let stock = obj.stockFromPastDays;
            let wasted = stock[0];
            if (obj.numberOfDays > 0) {
                stock.shift();
                stock.push(0);
            }
            details.stockFromPastDays = stock;

            (singleProduct.name = obj.name),
                (singleProduct.costPrice = obj.costPrice),
                (singleProduct.sellingPrice = obj.sellingPrice),
                (singleProduct.wasted = wasted);
            (singleProduct.image = obj.image);

            productDetails.push(singleProduct);
            let result = await Products.findOneAndUpdate(
                { name: `${obj.name}` },
                details
            );
        });

        return productDetails
    }
    catch (error) {
        throw new Error("Error in updating products stock", error)
    }
};

module.exports = updatestock