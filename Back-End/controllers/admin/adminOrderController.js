const mongoose = require("mongoose")
const Orders = require("../../models/orders").Orders;
const User = require("../../models/users").Users;
const dailyEachProducts =
  require("../../models/daily-each-product").dailyEachProducts;
const dailyDashboard = require("../../models/dailyDashboard");
const limit = 10;

async function getOrders(req, res) {
  try {
    const { date } = req.query;
    let page = parseInt(req.query.page);
    let startIndex = (page - 1) * limit;

    if (date) {
      let d = date;
      var nextDay = new Date(d);
      d = new Date(d);

      nextDay.setDate(nextDay.getDate() + 1);

      Promise.all([
        Orders.find({
          date: { $gte: d, $lt: nextDay },
        })
          .populate(
            "customerId",
            "first_name last_name",
            User
          )
          .sort({ status: -1, date: -1 })
          .skip(startIndex)
          .limit(limit),
        Orders.find({ date: { $gte: d, $lt: nextDay } }).countDocuments(),
      ])
        .then((result) => {
          return res.send({
            data: result[0],
            maxPages: Math.ceil(result[1] / limit),
          });
        })
        .catch((error) => {
          throw new Error("Error in getting Order Details", error);
        });
    } else {
      //console.log("else");
      Promise.all(
        [
          Orders.find({})
            .populate(
              "customerId",
              "first_name last_name",
              User
            )
            .sort({ status: -1, date: -1 })
            .skip(startIndex)
            .limit(limit),
            Orders.find({}).countDocuments()
        ]
      )
        .then((result) => {
          res.send({
            data: result[0],
            maxPages: Math.ceil(result[1] / limit),
          });
        })
        .catch((error) => {
          throw new Error("Error in getting Order Details", error);
        });
    }
  } catch (error) {
    //console.log(error);
    res
      .status(400)
      .send("Error in getting Order Details\nPlease refresh your page");
  }
}

async function todaysInfo(req, res) {
  try {
    let todayD = new Date();
    todayD = new Date(
      todayD.getFullYear(),
      todayD.getMonth(),
      todayD.getDate()
    );
    tommorrowDate = new Date(todayD);
    tommorrowDate.setDate(tommorrowDate.getDate() + 1);

    await dailyDashboard
      .findOne({date : {$gte : todayD, $lt : tommorrowDate}}, "date customers revenue profit orders loss -_id")
      .then((result) => {
        let data = {...result._doc}
        data.customers = data.customers.length
        res.send({data});
      })
      .catch((error) => {
        throw new Error("Error in getting Order Details", error);
      });
  } catch (error) {
    res
      .status(400)
      .send({message : "Error in getting Today's Order Details\nPlease refresh your page"});
  }
}

async function updateStatus(req, res) {
  try {
    let oid = new mongoose.Types.ObjectId(req.params.oid);

    await Orders.updateOne({_id : oid},{status : req.body.status})
      .then((r) => {
        res.send(r);
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

async function dashboard(req, res) {
  try {
    let todayD = new Date();
    todayD = new Date(
      todayD.getFullYear(),
      todayD.getMonth(),
      todayD.getDate()
    );
    tommorrowDate = new Date(todayD);
    tommorrowDate.setDate(tommorrowDate.getDate() + 1);

    await dailyEachProducts
      .find({ date: { $gte: todayD, $lt: tommorrowDate }})
      .then((result) => {
        res.send({data : result});
      })
      .catch((error) => {
        throw new Error("Error in getting dashboard Details", error);
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({message : "Error in getting Order Details\nPlease refresh your page"});
  }
}

async function weeklyCompare(req, res) {
  try {
    let p1 = req.params.p1;
    let p2 = req.params.p2;
    p1 = p1.charAt(0).toUpperCase() + p1.slice(1);
    p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
    //console.log("-----------------<",p1);

    let todayD = new Date();
    todayD = new Date(
      todayD.getFullYear(),
      todayD.getMonth(),
      todayD.getDate()
    );
    week = new Date(todayD);
    week.setDate(week.getDate() - 6);

    var nextDay = new Date("2023-01-19");
    d = new Date(nextDay);

    d.setDate(d.getDate() - 6);

    nextDay.setDate(nextDay.getDate() + 1);
    const result = await dailyEachProducts
      .find({
        date: { $gte: week, $lte: todayD },
        $or: [
          {
            product: { $eq: p1 },
          },
          {
            product: { $eq: p2 },
          },
        ],
      })
      .then((resu) => {
        // console.log(resu)
        res.send({data : resu});
      })
      .catch((error) => {
        throw new Error("Error in getting dashboard Details", error);
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error in getting Order Details\nPlease refresh your page");
  }
}

module.exports = {
  getOrders,
  dashboard,
  weeklyCompare,
  todaysInfo,
  updateStatus,
};
