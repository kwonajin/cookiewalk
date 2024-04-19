const asyncHandler = require("express-async-handler");
const User=require("../models/userModel");
const bcrypt = require("bcrypt"); //비밀번호 암호화
const { Mongoose } = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// @desc Get mypage page
// @route GET /
const getMypage = (req,res)=>{
  res.render("mypage",{ok:true })
};

module.exports={getMypage}