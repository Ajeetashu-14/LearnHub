const jwt=require("jsonwebtoken")
const { jwt_secret } = require("../config")

function adminMiddleware(req, res, next) {
    const token=req.headers.authorization
    const arr=token.split(" ")   //["Bearer","---token---"]
    const jwtToken=arr[1] 
    const value=jwt.verify(jwtToken,jwt_secret)
    if(value.username){  //username was encoded inside jwt
        next()
    }
    else{
        res.status(403).json({
            msg:"You are not authenticated"
        })
    }
}

module.exports = adminMiddleware;