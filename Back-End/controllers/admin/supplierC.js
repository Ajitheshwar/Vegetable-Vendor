const supplier = require("../../models/supplier");

const getDetails = async (req, res) => {
  //console.log('getting details')
  var supplierData = await supplier.find({}).sort({name : 1});
  await supplier.deleteMany({ category: [] });
  res.send(supplierData);
};
const addSupplier = async (req, res) => {
  var obj = req.body;

  var supplierx = new supplier({
    name: obj.name,
    products: obj.products.split(","),
    contactDetails: obj.contactDetails.split(",")
  });
  r = await supplierx.save();
  res.send('success')
};
const getAsupplier = async (req,res) => {
    
    var productName = req.params.id ;
    //console.log(productName)
    var result = await  supplier.find({products : {$in : [productName]}})
    //console.log(result)
    res.send(result)
}





module.exports = { getDetails, addSupplier ,getAsupplier};
