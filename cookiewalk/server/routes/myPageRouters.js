const express = require("express");
const router = express.Router();

//로그인확인
const cookieParser=require("cookie-parser");
const checkLogin= require("../middlewares/checkLogin")
const {getMypage} = require("../controllers/mypageController")

router.use(cookieParser());

router.route("/").get(getMypage);


module.exports = router;