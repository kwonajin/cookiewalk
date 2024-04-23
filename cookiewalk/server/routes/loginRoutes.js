const express = require("express");
const router = express.Router();
const cookieParser=require("cookie-parser");
const checkLogin= require("../middlewares/checkLogin")
const {getLogin, loginUser , getJoin, joinUser, logout} = require("../controllers/loginController")

router.route("/").get(getLogin).post(loginUser)

router.route("/join").get(getJoin).post(joinUser)

router.route("/logout").get(logout);


module.exports = router;
