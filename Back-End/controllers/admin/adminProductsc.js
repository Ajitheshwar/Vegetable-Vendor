const Products = require("../../models/products").Products;
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

const getAdminProducts = async (req, res) => {
  var products = await Products.find({});
  res.status(200).send({ products });
};

const updateTodayDetails = async (req, res) => {
  let data = req.body.data;
  try {
    for (let product of data) {
      let result = await Products.updateOne(
        { name: product.name },
        {
          $set: {
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            stockFromPastDays: product.quantity,
          },
        }
      );
    }
    let updatedData = await Products.find({});
    res.send({ message: "Updated Stock Successfully", data: updatedData });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Failed to update stock" });
  }
};

const updateProduct = async (req, res) => {
  let data = req.body;
  try {
    let result = await Products.updateOne(
      { _id: new mongoose.Types.ObjectId(data.id) },
      {
        $set: {
          name: data.name,
          category: data.category,
          subCategory: data.subCategory,
          description: data.description,
          benefits: data.benefits,
        },
      }
    );
    res.send({ message: "Product Updated Successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error in updating product" });
  }
};

const addAdminProduct = async (req, res) => {
  // console.log(req.headers)
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(400).send({ message : "something went wrong"});
    } else {
      try {
        let obj = { ...req.body };
        // console.log(obj);
        obj.benefits = JSON.parse(obj.benefits);
        obj.sellingPrice = parseInt(obj.sellingPrice);
        obj.costPrice = parseInt(obj.costPrice);
        obj.numberOfDays = parseInt(obj.numberOfDays);
        let stock = [];
        for (let i = 0; i < obj.numberOfDays; i++) stock.push(0);
        obj.stockFromPastDays = stock;
        obj.image = req.file.path;
        // console.log(obj)
        let doc = new Products(obj);
        let result = await doc.save();
        return res.send({ message: "Product Added Successfully" });
      } catch (error) {
        return res.send({message : "error"});
      }
    }
  });
};

const updateImage = async(req,res)=>{
  console.log("Hello")
  upload(req,res,async(err)=>{
    if(err){
      console.log(err);
      res.status(400).send({message : "Unable to update image"})
    }else{
      console.log(req.body)
      console.log(req.file)
      let result = await Products.updateOne({_id : new mongoose.Types.ObjectId(req.body.id)},{image : req.file.path})
      res.send({message : "Image updated Successfully"})
    }
  })
}

const upload = multer({
  storage: storage,
}).single("productImage");

module.exports = {
  getAdminProducts,
  addAdminProduct,
  updateProduct,
  updateTodayDetails,
  updateImage
};
