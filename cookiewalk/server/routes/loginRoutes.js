const express = require("express");
const router = express.Router();
const {getLogin, loginUser , getJoin, joinUser, logout,kakaologin, googlelogin} = require("../controllers/loginController")

router.route("/").get(getLogin).post(loginUser)
router.route("/kakaologin").get(kakaologin)
router.route("/googlelogin").get(googlelogin)

router.route("/join").get(getJoin).post(joinUser)

router.route("/logout").get(logout);


module.exports = router;
