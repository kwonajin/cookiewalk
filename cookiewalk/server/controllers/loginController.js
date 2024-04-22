const asyncHandler = require("express-async-handler");
// const User=require("../models/userModel");
// const { Mongoose } = require("mongoose");

const supabase = require("../config/supabaseClient")


const Token=require("../models/token");
const bcrypt = require("bcrypt"); //비밀번호 암호화
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

var client_id = process.env.NAVER_ID;
var client_secret = process.env.NAVER_SECRET;


// @desc Get Login page
// @route GET /
const getLogin = (req,res)=>{
  res.render("login",{ok:true })
};

// @desc Post Login page
// @route Post /
const loginUser = asyncHandler(async(req,res)=>{
  console.log(req.body);
  const {username, password}=req.body;
  if(!username || !password){
    return res.status(400).send("필수값이 입력되지 않았다.")
  }else {
    const loginUser= await User.findOne({user_id:username})
    if (!loginUser) {
      return res.status(401).render("login",{ok:false, message: "일치하는 아이디가 없슈"})
    }else {
      const isMatch = await bcrypt.compare(password, loginUser.password);
      if(!isMatch){
        return res.status(401).render("login",{ok: false, message: "비밀번호가 틀렸습니다."})
      }
    }
    const token = jwt.sign({id:loginUser.user_id},jwtSecret)
    console.log(token)
    res.cookie('token', token, {httpOnly:true})
  }
  res.redirect("mypage");
});

// @desc get Join page
// @route get /join
const getJoin = (req,res)=>{
  res.render("join",{ok:true })
};

// @desc Post Join page
// @route Post /join
const joinUser = asyncHandler(async(req,res)=>{
  const {user_id, name, email, password, password2}= req.body;
  if(password === password2){
    const hashPassword = await bcrypt.hash(password,10);
    const user = await User.create({
      user_id:user_id,
      password:hashPassword,
      email:email,
      name: name,
      nickname: "song",
      gender: "남",
      pfofile_image: "image",
      point:0,
      provider:'local'
    })
    res.redirect("/");
  }else {
    return res.status(401).render("join", {ok:false, message:"비밀번호가 일치하지 않아요"})
  }
});

//@desc logout
//@route Get /logout
const logout =asyncHandler(async(req,res) =>{
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecret);
  const logout= await Token.findOne({email:decoded.id})
  const url=`https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${client_id}&client_secret=${client_secret}&access_token=${logout.accesstoken}&service_provider=NAVER`
  const response= await fetch(url,{
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  });
  if(response.ok){
    console.log('접근토큰 삭제 성공')
  }else{
    console.log('삭제 실패')
  }
  console.log(logout.accesstoken)
  res.clearCookie("token");
  res.clearCookie("sid", { path: '/' });
  res.redirect("/");
});
// @desc get login kakao
// @route get /kakaologin
// const kakaologin= asyncHandler(async (req,res)=>{
//   const result = await signInWithKakao();
//   if (result.error) {
//     return res.status(400).json({ error: result.error });
//   }

//   res.json({
//     message: "Login successful",
//     user: result.user,
//     session: result.session
//   });
// });
const googlelogin= asyncHandler(async (req,res)=>{
})
async function signInWithKakao() {
  console.log(supabase);  
  console.log(supabase.auth);
  const { user, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
  });
}


module.exports={getLogin,loginUser, getJoin, joinUser ,logout, signInWithKakao, googlelogin}