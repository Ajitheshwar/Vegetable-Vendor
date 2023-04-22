const dailyDashboardModel = require("../../models/dailyDashboard");
const Products = require("../../models/products").Products;
const Users = require("../../models/users").Users;
const Admin = require("../../models/admin")

async function middlewareCreate(productsList, loss) {
    let obj = new dailyDashboardModel({
        product: productsList,
        loss: loss,
    });
    await obj.save().then((result) => {
        return result;
    }).
    catch(error=>{
        throw new Error("Error in updating today's dashbaoard",error)
    })
}

async function updateDailyDashboard(customerId, revenue) {
    try{
        // console.log(revenue)
        let date = new Date();
        let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let tomorrow = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
        );
        let dailyDashboardDatabase = await dailyDashboardModel.findOne({
            date: { $gte: today, $lt: tomorrow },
        });
        // console.log(dailyDashboardDatabase)
        let cus = dailyDashboardDatabase.customers;
        let profit = 0;
        let usersDatabase = await Users.findOne({ _id: customerId }).populate(
            "cart.productId"
        );
        // console.log(usersDatabase.cart)  ;
        let ca = usersDatabase.cart;
        for (let i = 0; i < ca.length; i++) {

            let index = ca[i].productId.numberOfDays >0 ? (Math.floor(Math.random()*ca[i].productId.numberOfDays)) : 0
            let updateStock = await Products.updateOne({name : ca[i].productId.name},{$inc : {[`stockFromPastDays.${index}`] : -ca[i].quantity}})

            profit +=
                (ca[i].productId["sellingPrice"] - ca[i].productId["costPrice"]) *
                ca[i].quantity;
        }
        if (!cus.includes(customerId)) {
            // console.log("new Customer for today")
            let a = await dailyDashboardModel.updateOne(
                { _id: dailyDashboardDatabase._id },
                { $push: { customers: customerId } }
            );
        }
        console.log(revenue)
        let r = await dailyDashboardModel.updateOne(
            { _id: dailyDashboardDatabase["_id"] },
            {
                $inc: { orders: 1, revenue: revenue, profit: profit },
            }
        ).then((result)=>{console.log(result)})
        .catch(err=>{console.log(err)})

        let adminUpdate = await Admin.updateOne({},{$inc : {totalRevenue : revenue, totalProfit : profit}})
        return r;
    }
    catch(error){
        throw new Error('Error in updating dashboard and stock', error)
    }
}

module.exports = { updateDailyDashboard, middlewareCreate}