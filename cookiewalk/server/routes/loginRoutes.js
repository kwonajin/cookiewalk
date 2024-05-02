const express = require("express");
const router = express.Router();
const {loginUser ,postSignup1,postSignup1_id,postSignup2,postSignup2_2,postSignup3,postSignup3_2,postSignup4, logout} = require("../controllers/loginController")

router.route("/").post(loginUser)

router.route("/join").post(postSignup1_id)

router.route("/join/signup1").post(postSignup1)
router.route("/join/signup2").post(postSignup2)
router.route("/join/signup2_2").post(postSignup2_2)
router.route("/join/signup3").post(postSignup3)
router.route("/join/signup3_2").post(postSignup3_2)
router.route("/join/signup4").post(postSignup4)

router.route("/logout").get(logout);


module.exports = router;
