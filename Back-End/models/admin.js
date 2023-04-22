const mongoose = require("mongoose")

const adminSchema = {
    email_address : {
        type : String,
    },
    password : {
        type : String,
    },
    totalProfit : {
        type : Number,
        default : 0,
    },
    totalRevenue : {    
        type : Number,
        default : 0,
    },
    totalLoss : {
        type : Number,
        default : 0,
    },
    modifiedStockAt : {
        type : Date,
        default : Date.now
    },
    notifications : {
        type : [{email : String, id : String}],
        default : []
    }
}

const Admin = mongoose.model('admin', adminSchema)
module.exports = Admin