const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User,Course } =require("../db")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../config")

router.post('/signup', (req, res) => {
    const username=req.body.username
    const password=req.body.password

    User.create({
        username,
        password
    })
        .then(function(){
            res.json({
                msg:"User created successfully"
            })
        })
});

router.post('/signin', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({
        username,
        password
    })
        .then(function (response) {
            if (response) {
                const token = jwt.sign({ username }, jwt_secret)
                res.json({
                    token
                })
            }
            else {
                res.status(411).json({
                    msg: "Incorrect email and password"
                })
            }
        })
});

router.get('/courses', (req, res) => {
    // listing all courses logic
    Course.find({})
        .then(function(response){
            res.json({
                courses:response
            })
        })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // course purchase logic
    const username=req.username
    const courseId=req.params.courseId

    User.updateOne({
        username:username
    },{
      "$push":{
        purchasedCourses:courseId
      }
    })
        .then(function(){
            res.json({
                msg:"Course purchased successfully"
            })
        })
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // fetching purchased courses logic
    const username=req.username
    User.findOne({
        username:username
    })
        .then(function(response){
            Course.find({
                _id:{
                    "$in":response.purchasedCourses
                }
            })
                .then(function(result){
                    res.json({
                        courses:result
                    })
                })
        })
});

module.exports = router