const express = require("express");
const router = express.Router();
const {getLogin, loginUser , getJoin, joinUser, logout,signInWithKakao, googlelogin} = require("../controllers/loginController")

require("dotenv").config();
const supabase = require("../config/supabaseClient")

router.route("/").get(getLogin).post(loginUser)
router.route("/kakaologin").get(
  async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo:'http://localhost:3000/mypage'
    }
  })
});
router.route("/googlelogin").get(googlelogin)

router.route("/join").get(getJoin).post(joinUser)

router.route("/logout").get(logout);


module.exports = router;
