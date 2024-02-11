const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../config")

// Admin Routes
router.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    Admin.create({
        username,
        password
    })
        .then(function () {
            res.json({
                msg: "Admin created successfully"
            })
        })
});

router.post('/signin', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    Admin.findOne({
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

router.post('/courses', adminMiddleware, (req, res) => {
    // course creation
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const imageLink = req.body.imageLink

    Course.create({
        title,
        description,
        imageLink,
        price
    })
        .then(function (response) {
            res.json({
                msg: "Course created successfully",
                courseId: response._id
            })
        })
});

router.get('/courses', adminMiddleware, (req, res) => {
    // fetching all courses
    Course.find({})
        .then(function (response) {
            res.json({
                courses: response
            })
        })
});

module.exports = router;