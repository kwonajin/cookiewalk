var express = require('express');
const router = express.Router();
const User=require("../models/userModel");
const Token=require("../models/token");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

var client_id = process.env.NAVER_ID;
var client_secret = process.env.NAVER_SECRET;
var state = 'hLiDdL2uhPtsftcU';
var redirectURI = encodeURI("http://localhost:3000/callback");
var api_url = "";


router.route('/naverlogin').get(function (req, res) {
  api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${ client_id}&redirect_uri=${redirectURI}&state=${state}`;
    // res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    // res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>")
    res.redirect(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${ client_id}&redirect_uri=${redirectURI}&state=${state}`)
});
router.route('/callback').get(async function (req, res) {
    code = req.query.code;
    state = req.query.state;
    api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${code}&state=${state}`;

    const response= await fetch(api_url,{
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    });
    const tokenRequest = await response.json();

    console.log(tokenRequest.access_token)

    //3단계: access_token으로 사용자 정보 받아오기
    if ("access_token" in tokenRequest){
      const {access_token}=tokenRequest;
      const apiUrl = "https://openapi.naver.com/v1/nid/me";

      const data = await fetch(apiUrl, {
        headers:{
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userData = await data.json();

      // console.log("userData:",userData)
      
      //jwt토큰생성
      const token = jwt.sign({id:userData.response.email},jwtSecret)
      res.cookie('token', token, {httpOnly:true})

      //계정 있는지 검색
      const user= await User.findOne({email:userData.response.email})

      // 데이터베이스 계정 입력
      if(!user){
        const newUser = await User.create({
        user_id:userData.response.nickname,
        password:null,
        email:userData.response.email,
        name: userData.response.name,
        nickname: userData.response.nickname,
        gender: userData.response.gender,
        pfofile_image: "image",
        point:0,
        provider:'Naver'
        })
        const newToken = await Token.create({
        email:userData.response.email,
        accesstoken: tokenRequest.access_token,
        provider:'Naver'
      })
    }else{
      //재발급
      // const url=`https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${tokenRequest.access_token}`
      // const re_response= await fetch(url,{
      // headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
      // });
      // const re_tokenRequest = await re_response.json();

      //토큰 데이터베이스 재발급받은_토큰으로 수정
      var qry= {email:user.email}
      var vals={$set: {accesstoken:tokenRequest.access_token}}
      const refresh = await Token.updateOne(qry,vals)
      console.log('이미 가입했습니다.')
    }
    }

    
    return res.redirect("/mypage");
});

module.exports=router
