const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const orderSchema = {
    date: {
        type: Date,
        default : Date.now
    },
    address: {
        type: {
            houseNumber: { type: String },
            floor: { type: Number },
            landmark: { type: String },
            streetNumber: { type: Number },
            colony: { type: String },
            area: { type: String },
            district: { type: String, default : "Hyderabad" },
            pincode: { type: String },
            title: { type: String },
        },
    },
    products: {
        type: [
            {
                name: { type: String },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "daily-each-product",
                },
                quantity: { type: Number },
            },
        ],
    },
    status: {
        type: String,
        default: "Pending",
        enum:["Pending","Delivered","Out_for_Delivery"]
    },
    modeOfPayment: {
        type: String,
        default: "COD",
        enum : ["COD", "Net Banking"]
    },
    totalCost: {
        type: Number,
    },
    customerId : {
        type : mongoose.Schema.Types.ObjectId
    }
};

const Orders = mongoose.model("order", orderSchema);
module.exports = { Orders };