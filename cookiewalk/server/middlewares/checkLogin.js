const jwt= require('jsonwebtoken')
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = async(req, res, next) => {
  res.setHeader("Cashe-Control", "no-cache, no-store, must-revalidate")

  //요청에 포함된 쿠키에서 토큰값 가져오기
  const token= req.cookies.token;
  if(!token){   //토큰이 없을시 로그인 페이지로 이동
    return res.redirect("/")
  }
  try{
    const decoded = jwt.verify(token, jwtSecret); //토큰해석
    req.username = decoded.username; //토큰의 사용자 이름을 요청하고 사용자 이름에 할당
    next();
  }catch{
    return res.status(401).json({message:'로그인이 필요합니다.'})
  }
}

module.exports =checkLogin;