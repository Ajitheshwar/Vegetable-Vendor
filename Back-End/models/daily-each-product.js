const mongoose = require("mongoose");

const dailyEachProductSchema = {
    product: {
        type: String,
        required : true,
    },
    date: {
        type: Date,
        default : Date.now
    },
    quantity: {
        type: Number,
        default : 0
    },
    costPrice: {
        type: Number,
    },
    sellingPrice: {
        type: Number,
    },
    wasted: {
        type: Number,
    },
    image : {
        type : String
    }
};

const dailyEachProducts = mongoose.model(
    "daily-each-product",
    dailyEachProductSchema
);

module.exports = { dailyEachProducts };
