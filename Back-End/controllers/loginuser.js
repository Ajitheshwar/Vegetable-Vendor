const Users = require("../models/users").Users;
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const maxAge = 24 * 60 * 60; //one day
const createToken = (id, email, role) => {
  let secretKey = role==="admin" ? process.env.SECRETKEYADMIN : process.env.SECRETKEYUSER
  return jwt.sign({ id, email, role }, secretKey, {
    expiresIn: maxAge,
  });
};
const display_login_page = (req, res) => {
  console.log("hello from login");
  console.log(__dirname);
};

const login_user = async (req, res) => {
  // console.log(req.body);
  var role = null,
    data = null;
  let email_address = req.body.email;
  let password = req.body.password;
  let token
  if (email_address === "admin@gmail.com") {
    role = "admin";
    data = await Admin.find({ email_address: `${email_address}` });
  } else {
    role = "user";
    data = await Users.find({ email_address: `${email_address}` });
  }

  //console.log(data.length)
  if (!data.length) {
    res.status(400).send({ message: "invalid credentials" });
  } else {
    data = data[0];
    token = createToken(data._id, data.email_address, role);
    var flag = await bcrypt.compare(password, data.password);
    //console.log(flag + role)
    if (role === "admin" && data.password === password) {
      flag = "true";
    }
    if (flag) {
      //validation
      res.status(200).json({
        message: "login successfull",
        id: data._id,
        email: data.email_address,
        name: data.first_name,
        role : role,
        token: token,
      });
    } else {
      res.status(400).send({ message: "invalid credentials" });
    }
  }
};

async function addUser(obj, req, res) {
  let user = new Users(obj);
  try {
    let result = await user.save();
    res.send({ message: "registered successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err);
  }
}

const signup_user = async (req, res) => {
  // console.log(req.body)
  let data = await Users.findOne(
    { email_address: `${req.body.email_address}` },
    "email"
  ); 

  if (data) {
    res.status(400).send({ message: "emailID already exits" });
  } else {
    var obj = req.body;
    await addUser(obj, req, res);
  }
};

const resetPassword = async (req,res) =>{
    console.log(req.body)
    let data = await Users.findOne({email_address : req.body.email})
    if(data){
        const salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(req.body.password , salt)
        let result = await Users.updateOne({email_address : req.body.email},{password : hashedPassword})
        res.send({message : "Updated Password Successfully"})
    }
    else{
        res.status(400).send({message : "Email doesn't exist"})
    }
}

module.exports = { login_user, display_login_page, signup_user, resetPassword };
