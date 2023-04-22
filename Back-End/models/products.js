const mongoose = require("mongoose");

const productSchema = {
    name: {
        type: String,
        required : [true , 'name is required']
    },
    description: {
        type: String,
    },
    benefits: {
        type: [String],
    },
    category: {
        type: String,
        required : [true , 'category is required']
    },
    subCategory: {
        type: String,
        required : [true , 'subCategory is required']
    },
    sellingPrice: {
        type: Number,
        required : [true , 'sellingPrice is required']
    },
    costPrice: {
        type: Number,
        required : [true , 'costPrice is required']
    },
    numberOfDays: {
        type: Number,
        required : true ,
    },
    stockFromPastDays: {
        type: [Number],
    },
    unitsInKG: {
        type: Boolean,
    },
    date : {
        type : Date,
    },
    image: {
        type: String,
    },
};

const Products = mongoose.model("product", productSchema);

module.exports = { Products };
