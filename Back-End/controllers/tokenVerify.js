const jwt = require("jsonwebtoken")

const verifyToken = async(req,res,next)=>{
    // console.log(req.headers)
    let tokenWithBearer = req.headers["authorization"]
    let role = req.headers["role"]
    // console.log(tokenWithBearer, role)
    if(tokenWithBearer === undefined){
        return res.send({message : "Please Login to continue"})
    }

    if(tokenWithBearer.startsWith("Bearer ")){
        let token = tokenWithBearer.split(" ")[1]
        // console.log(token)
        let secretKey = role==="admin"?process.env.SECRETKEYADMIN : process.env.SECRETKEYUSER
        jwt.verify(token, secretKey, (err, decoded)=>{
            if(err || decoded.role!==role){
                // console.log("Error")
                return res.send({message : "Unauthorized access"})
            }
            else{
                next()
            }
        })
    }else{
        return res.status(400).send({message : "Unauthorized access"})
    }
}

module.exports = verifyToken