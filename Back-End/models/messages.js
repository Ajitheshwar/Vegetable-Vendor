const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        user: {
            type: String,
        },
        sender: {
            type: String,
            default: "admin",
        },
        message: {
            type: String,
        },
        time : {
            type : Date,
            default : Date.now
        }
    }
);
const Messages = mongoose.model("message", messageSchema);
module.exports = Messages;
