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

async function addNewProduct(obj) {
  let stock = [0, 0, 0, 0, 0, 0];
  let benefits = obj.benefits.split(",");

  stock.push(obj.stockFromPastDays);

  let product = new Products({
    name: obj.name,
    description: obj.description,
    benefits: benefits,
    category: obj.category,
    subCategory: obj.subCategory,
    sellingPrice: obj.sellingPrice,
    costPrice: obj.costPrice,
    numberOfDays: obj.nunberOfDays,
    stockFromPastDays: stock,
    unitsInKG: true,
    image: "./",
  });

  let result = await product.save();
  return result;
}

const getAdminProducts = async (req, res) => {
  var products = await Products.find({});
  res.status(200).send({ products });
};
const addAdminProduct = async (req, res) => {
  let product = req.body;
  try {
    let result = await addNewProduct(product);
    res.send(result);
  } catch (err) {
    res.send({ error: err.message });
  }
};

const updateTodayDetails = async (req, res) => {
  let data = req.body.data
  try{
    for(let product of data){
      let result = await Products.updateOne({name : product.name},{$set : {costPrice : product.costPrice, sellingPrice : product.sellingPrice, stockFromPastDays : product.quantity}})
    }
    let updatedData = await Products.find({})
    res.send({message : 'Updated Stock Successfully', data : updatedData})
  }catch(error){
    console.log(error)
    res.status(400).send({message : "Failed to update stock"})
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

const imageUpload = async (req, res) => {

  upload(req, res, async (err) => {
    if (err) {
      res.status(400).send("something went wrong");
    } else {
      try {
        let result = await createFile(req, res);

        return res.send("success");
      } catch (error) {
        return res.send("error");
      }
    }
  });
};

const upload = multer({
  storage: storage,
}).single("productImage");

async function createFile(req, res) {
  let Pname = req.headers.authorization.split(" ")[2];

  const userUpdate = await Products.findOneAndUpdate(
    { name: Pname },
    {
      image: req.file.path,
    }
  )
    .then((result) => {})
    .catch((err) => console.log("err"));
}

module.exports = {
  getAdminProducts,
  addAdminProduct,
  updateProduct,
  imageUpload,
  updateTodayDetails,
};
