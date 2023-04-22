const multer = require("multer");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { Users } = require("../../models/users");
const Messages = require("../../models/messages");
const Admin = require("../../models/admin");

// Configuration
cloudinary.config({
  cloud_name: "dsrogc0uc",
  api_key: "579719444287652",
  api_secret: "F9g2XMhAnOWoiTo7MIKLFimmE9Y",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Vegetable-Vendor",
    public_id: (req, file) => file.originalname + new Date().toISOString(),
  },
});

const profileUploadMulter = async (req, res) => {
  try {
    // console.log("--1");
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        res.status(400).send("something went wrong");
      } else {
        try {
          let result = await createFile(req, res);
          //console.log("result", result);
          return res.send({ message: req.file.path });
        } catch (error) {
          console.error(error);
          return res.send("error");
        }
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error in getting Dashboard Details\nPlease refresh your page");
  }
};

const upload = multer({
  storage: storage,
}).single("profileImage");

async function createFile(req, res) {
  // console.log("--3");
  // console.log("hi" + req.file);
  const userUpdate = await Users.findByIdAndUpdate(req.headers.id, {
    image: req.file.path,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => console.log("err"));
}

async function userDetails(req, res) {
  try {
    const userUpdate = await Users.findOne(
      { _id: new mongoose.Types.ObjectId(req.headers.id) },
      "image first_name last_name contact_number email_address"
    )
      .then((resu) => {
        res.send(resu);
      })
      .catch((error) => {
        throw new Error("Error in getting User Details", error);
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Error in getting User Page\nPlease refresh your page");
  }
}

async function updateProfile(req, res) {
  try {
    let obj = req.body;
    //console.log(obj.firstName);

    const result = await Users.findByIdAndUpdate(req.headers.id, {
      first_name: obj.first_name,
      last_name: obj.last_name,
      contact_number: obj.contact_number,
      email_address: obj.email,
    })
      .then((res1) => {
        // console.log(res1);
        res.send(res1);
      })
      .catch((error) => {
        throw new Error("Error in Updating Profile", error);
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({message : "Error in  Updating Profile\nPlease refresh your page"});
  }
}

const getCart = async (req, res) => {
  try {
    let objectId = new mongoose.Types.ObjectId(req.headers.id);
    Users.findOne({ _id: objectId }, "cart")
      .populate(
        "cart.productId",
        "name category subCategory sellingPrice image"
      )
      .then((data) => {
        //console.log(data)
        res.status(200).send({ data });
      })
      .catch((error) => {
        throw new Error("Error in getting Cart", error);
      });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      message: "Error in getting your cart\nPlease refersh your page",
    });
  }
};

const updateCart = async (req, res) => {
  try {
    console.log(req.body);
    let cart = req.body.cart;

    let objectId = new mongoose.Types.ObjectId(req.headers.id);
    Users.updateOne({ _id: objectId }, { cart: cart })
      .then((data) => {
        console.log(data);
        res.status(200).send({ message: "Updated Successfully" });
      })
      .catch((error) => {
        throw new Error("Error in updating cart", error);
      });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Error in updating cart\nPlease refresh your page" });
  }
};

const updateAddress = async (req, res) => {
  try {
    console.log(req.body.address)
    let objectId = new mongoose.Types.ObjectId(req.headers.id);
    Users.updateOne(
      { _id: objectId },
      { $push: {addresses : req.body.address} }
    )
      .then((data) => {
        res.status(200).send({message : "Address Added Successfully"});
        return;
      })
      .catch((error) => {
        throw new Error("Error in updating Address", error);
      });
  } catch (error) {
    //console.log(error);
    res
      .status(400)
      .send({ message: "Error in updating Address\nPlease refresh your page" });
  }
};

const getAddresses = async (req, res) => {
  try {
    let objectId = new mongoose.Types.ObjectId(req.headers.id);
    let result = await Users.findOne({ _id: objectId }, "addresses");
    res.status(200).send({message : result.addresses});
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      message: "Error in getting your Addresses\nPlease refresh your page",
    });
  }
};

const deleteAddress = async (req,res)=>{
  try{
    let objectId = new mongoose.Types.ObjectId(req.headers.id)
    let result = await Users.updateOne({_id : objectId},{$pull : {addresses : {_id : new mongoose.Types.ObjectId(req.body.id)}}})
    res.send({message : "Address Deleted successfully"})
  }catch(error){
    res.status(400).send({
      message : "Error in deleting address"
    })
  }
}

const addMessage = async (req, res) => {
  //console.log(req.body);
  try {
    let message = new Messages(req.body);
    let result = await message.save();
    if (req.body.sender === "admin") {
      let userNotification = await Users.updateOne(
        { email_address: req.body.user },
        { notification: true }
      );
    } else {
      let adminNotifications = await Admin.findOne(
        { email_address: "admin@gmail.com" },
        "notifications"
      );
      let flag = true;
      for (let notification of adminNotifications.notifications) {
        if (notification.email === req.body.user) {
          flag = false;
        }
      }
      if (flag) {
        let adminAddNotification = await Admin.updateOne(
          { email_address: "admin@gmail.com" },
          {
            $push: {
              notifications: {
                email: req.body.user,
                id: req.headers.id,
              },
            },
          }
        );
      }
    }
    res.status(200).send({message : "Message Sent Successfully"});
  } catch (error) {
    console.error(error);
    res.status(400).send({message : "Error in sending Message"});
  }
};

const getMessages = async (req, res) => {
  try {
    let user = req.params.email;
    let result = await Messages.find({ user: user });
    res.status(200).send({messages : result});
  } catch (error) {
    console.error(error);
    res.status(400).send({message : "Error in getting Messages"});
  }
};

const updateNotificationStatus = async (req, res) => {
  let notificationStatus = req.params.status;
  let id = req.headers.id;
  let result = await Users.updateOne(
    { _id: id },
    { notification: notificationStatus }
  );
  res.status(200).send({message : "Updated Notification to " + notificationStatus});
};

module.exports = {
  profileUploadMulter,
  userDetails,
  updateProfile,
  getCart,
  updateCart,
  updateAddress,
  getAddresses,
  deleteAddress,
  addMessage,
  getMessages,
  updateNotificationStatus,
};
