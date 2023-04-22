const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors());
const Orders = require("../../models/orders").Orders;
const User = require("../../models/users").Users;
const dailyEachProducts =
  require("../../models/daily-each-product").dailyEachProducts;
const dailyDashboard = require("../../models/dailyDashboard");

async function getOrders(req, res) {
  try {
    let totaldocs = await Orders.countDocuments();
    let results = {};
    //console.log("getOrders");
    let s1;
    const { date, name } = req.query;
    //console.log(date);
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let sort = parseInt(req.query.sort);
    //console.log(sort);
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;

    if (date) {
      //console.log("date");
      let d = date;
      var nextDay = new Date(d);
      d = new Date(d);
      //console.log("n", d);
      nextDay.setDate(nextDay.getDate() + 1);
      // console.log("d", d);
      // console.log("2", nextDay);

      const result = await Orders.find({
        date: { $gt: new Date(d), $lt: new Date(nextDay) },
      })
        .populate(
          "customerId",
          "first_name last_name email_address contact_number",
          User
        )
        .populate("products.productId", "sellingPrice", dailyEachProducts)
        .sort({ status: -1, date: -1 })
        .limit(limit)
        .skip(startIndex)
        .exec()
        .then((r) => {
          return res.send(r);
        })
        .catch((error) => {
          throw new Error("Error in getting Order Details", error);
        });
    } else if (name) {
      //console.log("name", name);
      await Orders.find()
        .populate({
          path: "customerId",
          model: User,
          match: {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ["$first_name", " ", "$last_name"],
                },
                regex: name,
                options: "i",
              },
            },
          },
        })
        .sort({ status: -1, date: -1 })
        .exec()
        .then(async (r) => {
          //console.log(r[0].customerId);
          let rr = [];
          page = parseInt(page);
          startIndex = parseInt(startIndex);
          limit = parseInt(limit);
          // console.log("start", startIndex);
          // console.log("--", startIndex + limit);
          let coun = 0;
          for (let i = 0; i < r.length; i++) {
            if (r[i].customerId != null) {
              rr.push(r[i]);
            }
          }

          res.send(rr.slice(startIndex, startIndex + limit));
        })
        .catch((error) => {
          throw new Error("Error in getting Order Details", error);
        });
    } else {
      //console.log("else");
      const result = await Orders.find({})
        .populate(
          "customerId",
          "first_name last_name email_address contact_number",
          User
        )
        .populate("products.productId", "sellingPrice", dailyEachProducts)
        .sort({ status: -1, date: -1 })
        .limit(limit)
        .skip(startIndex)
        .exec()
        .then((result3) => {
          results.result = result3;
          results.totaldocs = totaldocs;
          res.send(results);
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
    await dailyDashboard
      .findOne({})
      .sort({ date: -1 })
      .then((resul) => {
        res.send(resul);
      })
      .catch((error) => {
        throw new Error("Error in getting Order Details", error);
      });
  } catch (error) {
    //console.log(error);

    res
      .status(400)
      .send("Error in getting Order Details\nPlease refresh your page");
  }
}

async function changePending(req, res) {
  let oid = req.body.oid;
  try {
    await Orders.findByIdAndUpdate(oid, { status: "Delivered" })
      .then((r) => {
        //console.log(r);
        res.send(r);
      })
      .catch((error) => {
        throw new Error("Error in getting Order Details", error);
      });
  } catch (error) {
    //console.log(error);
    res
      .status(400)
      .send("Error in getting Order Details\nPlease refresh your page");
  }
}

async function updatePending(req, res) {
  try {
    let oid = req.params.oid;
    //console.log(oid);
    await Orders.findById(oid)
      .then((r) => {
        //console.log(r);
        res.send(r); //64305417972c462c16955eab
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

async function hi(req, res) {
  try {
    const result = await Orders.find({})
      .populate("customerId", "first_name", User)
      .populate("products.productId", "sellingPrice", dailyEachProducts)
      .then((resu) => {
        res.send(resu);
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

    const result = await dailyEachProducts
      .find({ date: { $gte: todayD, $lt: tommorrowDate } })
      .then((resu) => {
        //console.log(resu.length);
        res.send(resu);
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
    // console.log("weekly")
    // console.log(todayD);
    // console.log(week);
    var nextDay = new Date("2023-01-19");
    d = new Date(nextDay);
    //console.log("n", d);
    d.setDate(d.getDate() - 6);
    //console.log("d", d);
    nextDay.setDate(nextDay.getDate() + 1);
    const result = await dailyEachProducts
      .find({
        date: { $gte: week, $lte: todayD },
        // $or:[{'product':{$eq:{product:{ $toLower: "$product" }}}}]
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
        res.send(resu);
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
  hi,
  getOrders,
  dashboard,
  weeklyCompare,
  todaysInfo,
  changePending,
  updatePending,
};
