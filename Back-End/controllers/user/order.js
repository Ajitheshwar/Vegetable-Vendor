const mongoose = require("mongoose");
const Orders = require("../../models/orders").Orders;
const Users = require("../../models/users").Users;
const dailyEachProducts = require("../../models/daily-each-product").dailyEachProducts
const updateDailyProduct =
  require("../admin/dailyEachProduct").updateDailyProduct;
const updateDailyDashboard =
  require("../admin/dailyDashboard").updateDailyDashboard;

const addOrders = async function (req, res) {
  // console.log(req.body);
  let session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      let data = (req.body);
      let objectId = new mongoose.Types.ObjectId(req.headers.id);
      // console.log(data)
      let result11 = await updateDailyProduct(objectId);
      // console.log(result11)

      let user = await Users.findOne({ _id: objectId }, "cart");
      let cart = user.cart;
      for (let i = 0; i < cart.length; i++) {
        cart[i].productId = result11[i];
      }
      let obj = {
        ...data,
        products: cart,
        customerId: objectId,
      };
      // console.log(obj)
      //console.log("object Id",objectId);
      let resultDailyDashboard = await updateDailyDashboard(
        objectId,
        data.totalCost
      );
      console.log(resultDailyDashboard)
      let orders = new Orders(obj);
      let result = await orders.save();

      let result1 = await Users.updateOne(
        { _id: objectId },
        { $push: { orders: result._id }, cart: [] }
      );

      res.send({message :"Order placed successfully"});
    });
  } catch (error) {
    console.log("Error in placing Order", error);
    res.status(400).send({ message: "Error in placing Order" });
  }
  finally{
    session.endSession()
  }
};

async function displayOrders(req, res) {
  try {
    
    let objectId = new mongoose.Types.ObjectId(req.headers.id);

    Orders.find({ customerId: objectId })
      .populate(
        "products.productId",
        "name sellingPrice category image",
        dailyEachProducts
      )
      .populate(
        "customerId",
        "first_name last_name email_address contact_number",
        Users
      )
      .then((result) => {
        res.send({message : result});
      })
      .catch((error) => {
        throw new Error("Error in getting Order Details", error);
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error in getting Order Details\nPlease refresh your page");
  }
}

module.exports = { addOrders, displayOrders };
