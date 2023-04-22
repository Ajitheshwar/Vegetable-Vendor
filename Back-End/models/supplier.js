const mongoose = require("mongoose");
const supplierSchema = mongoose.Schema({
  name: {
    type: String,
  },
  products: {
    type: [String],
  },
  contactDetails: {
    type: [Number],
  },
});

const supplier = mongoose.model('supplier' , supplierSchema)


const addSuppliers = async ()=>{
    result = await supplier.insertMany([
    {
        name : "mahesh",
        products : ["Tomato" , "Potato"],
        contactDetails : [1234567890 , 1234567890 ]

    },
    {
        name : "raju",
        products : ["Bell Papper" , "Onions"],
        contactDetails : [1234567890 , 1234567890 ]

    },
    {
        name : "akhil",
        products : ["Strawberry" , "Green Beans"],
        contactDetails : [1234567890 , 1234567890 ]

    },
    {
        name : "mani",
        products : ["Carrot" , "Brinjal" , "GreenCabbage"],
        contactDetails : [1234567890 , 1234567890 ]

    },

])

    console.log(result);
}


// const deletes = async ()=>{
// await supplier.deleteMany({});
// }

// deletes();


//addSuppliers();

module.exports = supplier ;