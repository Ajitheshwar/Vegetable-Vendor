const userController = require("../../controllers/user/users");
const userDetailsRoute = require("express").Router()

userDetailsRoute.get("/cart", userController.getCart);

userDetailsRoute.post("/updateCart", userController.updateCart);

userDetailsRoute.post("/updateAddress", userController.updateAddress);

userDetailsRoute.get("/getAddresses", userController.getAddresses);

userDetailsRoute.put("/deleteAddress",userController.deleteAddress)

userDetailsRoute.post("/profileUpload", userController.profileUploadMulter);

userDetailsRoute.post("/updateProfile", userController.updateProfile);

userDetailsRoute.get("/profileDetails", userController.userDetails);

userDetailsRoute.post("/sendMessage", userController.addMessage);

userDetailsRoute.get("/getMessages/:email",userController.getMessages)

userDetailsRoute.post("/updateNotificationStatus/:status",userController.updateNotificationStatus)

module.exports = userDetailsRoute