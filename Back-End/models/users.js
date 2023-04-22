const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const {isEmail} =require('validator')
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    contact_number: {
        type: Number,
        required : [true , 'contact_number is required']
    },
    email_address: {
        type: String,
        required : true,
        validate : [isEmail , 'enter a valid Email-address']
    },
    password: {
        type: String,
        required : true,
        minlength: 3,
        maxlength: 30
    },
    cart: {
        type: [
            {
                name: { type: String },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                },
                quantity: { type: Number },
            },
        ],
        default : []
    },
    addresses: {
        type: [
            {
                houseNumber: { type: String },
                floor: { type: Number },
                landmark: { type: String },
                streetNumber: { type: Number },
                colony: { type: String },
                area: { type: String },
                district: { type: String, default: "Hyderabad" },
                pincode: { type: String },
                title: { type: String },
            },
        ],
        default : []
    },
    orders : {
        type : [mongoose.Schema.Types.ObjectId],
        default : []
    },
    otp : {
        type: Number ,
    },
    image : {
        type : String,
        default : ""
    },
    notification : {
        type : Boolean,
        default : false,
    }
});



userSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt)
    next();

  })

const Users = mongoose.model("user", userSchema);
module.exports = { Users };
