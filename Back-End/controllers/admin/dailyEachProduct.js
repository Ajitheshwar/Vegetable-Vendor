const { Users } = require("../../models/users");
const dailyEachProducts =
    require("../../models/daily-each-product").dailyEachProducts;

async function updateDailyProduct(objectId) {
    //console.log('updateDailyEachProduct')
    try{
        let products = await Users.findOne({ _id: objectId }, "cart").populate(
            "cart.productId"
        );

        // console.log(products.cart)

        if(products.cart.length == 0){
            throw new Error("Cart is empty")
        }
        let a = new Date();
        let today = new Date(a.getFullYear(), a.getMonth(), a.getDate());
        let tomorrow = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1);
        // console.log(today);
        let productArray = [];
        for (let product of products.cart) {
    
            let result111 = await dailyEachProducts.findOneAndUpdate(
                { product: product.name, date: { $gte: today, $lte: tomorrow } },
                { $inc: { quantity: product.quantity } }
            );
            productArray.push(result111._id);
        }
        return productArray;
    }
    catch(error){
        throw new Error('Error in updating Daily Each products',error)
    }
}

async function addTodayData(products) {
    try{
        let totalLoss = 0;
        let productList = []
        for (let product of products) {
            let obj = {
                product: product.name,
                wasted: product.wasted,
                costPrice: product.costPrice,
                sellingPrice: product.sellingPrice,
                image : product.image
            };
            totalLoss += product.costPrice * product.wasted;
            let doc = new dailyEachProducts(obj);
            let result = await doc.save();
            productList.push(result._id)
        }
        return {productList, totalLoss};
    }
    catch(error){
        throw new Error("Error in adding today's data in dailyEachProduct",error)
    }
}
module.exports = { updateDailyProduct, addTodayData };
