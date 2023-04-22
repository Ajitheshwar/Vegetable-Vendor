const User = require("../../models/users").Users;
const limit = 10

async function displayCustomers(req, res) {
  try {
    let totaldocs = await User.countDocuments();
    let result = {};
    const page = parseInt(req.query.page);
    let name = req.query.name;
    const startIndex = (page - 1) * limit;
    if (name) {
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
      }).exec()
        .then((result3) => {
          result.data = result3;
          result.maxPages = Math.ceil(totaldocs/10);
          res.send(result);
        })
        .catch((error) => {
          throw new Error("Error in getting user details", error);
        });
    } else {
      try {
        await User.find()
          .limit(limit)
          .skip(startIndex)
          .exec()
          .then((result3) => {
            result.data = result3;
            result.maxPages = Math.ceil(totaldocs/10);
            res.send(result);
          })
          .catch((error) => {
            throw new Error("Error in getting user details", error);
          });
      } catch (e) {
        res.status(500).json({ message: e.message });
      }
    }
  } catch (error) {
    //console.log(error);
    res
      .status(400)
      .send("Error in getting customers Details\nPlease refresh your page");
  }
}
module.exports = {
  displayCustomers,
};
