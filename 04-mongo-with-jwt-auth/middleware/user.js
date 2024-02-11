const jwt=require("jsonwebtoken")
const { jwt_secret } = require("../config")

function userMiddleware(req, res, next) {
    const token=req.headers.authorization
    const arr=token.split(" ")  
    const jwtToken=arr[1] 
    const value=jwt.verify(jwtToken,jwt_secret)
    if(value.username){ 
        req.username=value.username
        next()
    }
    else{
        res.status(403).json({
            msg:"You are not authenticated"
        })
    }
}

module.exports = userMiddleware;