const asyncHandler = require("express-async-handler");
const User=require("../models/userModel");
const bcrypt = require("bcrypt"); //비밀번호 암호화
const { Mongoose } = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

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
    const token = jwt.sign({id:loginUser},jwtSecret)
    res.cookie('token', token, {httpOnly:true})
  }
  res.status(201).send("로그인 성공!")
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
      nickname: "sog",
      gender: "남",
      pfofile_image: "image",
      point:0
    })
    res.redirect("/");
  }else {
    return res.status(401).render("join", {ok:false, message:"비밀번호가 일치하지 않아요"})
  }
});

// @desc logout
// @route Get /logout
const logout =(req,res) =>{
  res.clearCookie("token");
  res.redirect("/");
}

module.exports={getLogin,loginUser, getJoin, joinUser, logout }