const User = require("../../models/users").Users;
const mongoose = require("mongoose");
const { dailyEachProducts } = require("../../models/daily-each-product");
const { Orders } = require("../../models/orders");
const { Users } = require("../../models/users");
const limit = 10;

async function displayCustomers(req, res) {
  try {
    let result = {};
    const page = parseInt(req.query.page);
    let name = req.query.name;
    const startIndex = (page - 1) * limit;
    let email = req.query.email;

    if (name) {
      Promise.all([
        User.find({
          $expr: {
            $regexMatch: {
              input: {
                $concat: ["$first_name", " ", "$last_name"],
              },
              regex: name,
              options: "i",
            },
          },
        })
          .skip(startIndex)
          .limit(limit),
        User.find({
          $expr: {
            $regexMatch: {
              input: {
                $concat: ["$first_name", " ", "$last_name"],
              },
              regex: name,
              options: "i",
            },
          },
        }).countDocuments(),
      ])
        .then((result3) => {
          result.data = result3[0];
          result.maxPages = Math.ceil(result3[1] / 10);
          res.send(result);
        })
        .catch((error) => {
          throw new Error("Error in getting user details", error);
        });
    } else if (email) {
      Promise.all([
        User.find({ email_address: { $regex: email, $options: "i" } })
          .skip(startIndex)
          .limit(limit),
        User.find({
          email_address: { $regex: email, $options: "i" },
        }).countDocuments(),
      ]).then((result) => {
        res.send({ data: result[0], maxPages: Math.ceil(result[1] / 10) });
      });
    } else {
      try {
        Promise.all([
          User.find().skip(startIndex).limit(limit),
          User.countDocuments(),
        ])
          .then((result3) => {
            result.data = result3[0];
            result.maxPages = Math.ceil(result3[1] / 10);
            res.send(result);
          })
          .catch((error) => {
            throw new Error("Error in getting user details", error);
          });
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error in getting customers Details\nPlease refresh your page");
  }
}

const singleCustomer = async (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);

  try {
    await Users.findById(id)
      .populate(
        "orders",
        "date modeOfPayment status totalCost",
        Orders
      )
      .then((result) => {
        console.log(result)
        res.send({ data: result });
      })
      .catch((error) => {
        throw new Error("Error in getting single customer details");
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Error in getting single customer details" });
  }
};

const orderDetails = async(req,res)=>{
  let id = req.params.id
  try{
    await Orders.findOne({_id : new mongoose.Types.ObjectId(id)})
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
  .then(result=>{
    res.send({data : result})
  })
  .catch(error=>{
    throw new Error("Error in getting order dertails",error)
  })
  }catch(error){
    res.status(400).send({message : "Unable to get order details"})
  }
}

module.exports = {
  displayCustomers,
  singleCustomer,
  orderDetails
};
