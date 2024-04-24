const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt"); //비밀번호 암호화
require("dotenv").config();
const supabase = require("../config/supabaseClient")
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

var client_id = process.env.NAVER_ID;
var client_secret = process.env.NAVER_SECRET;

// @desc Post Login page
// @route Post /
const loginUser = asyncHandler(async(req,res)=>{
  console.log(req.body);
  const {username, password}=req.body;
  // const hashPassword = await bcrypt.hash(password,10);
  // console.log(hashPassword)
  const { data, error } = await supabase
      .from('user')
      .select('password') // Assuming you store only the hashed password
      .eq('user_id', username)
    if (error) {
      console.error('Database error:', error.message);
      return res.status(500).send('Internal Server Error');
    }
    if (!data) {
      return res.send('일치하는 아이디 없음');
    }
    const user=data[0]
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (passwordIsValid) {
      //jwt 토큰생성
      const token = jwt.sign({id:username},jwtSecret)
      // console.log(token)
      res.cookie('token', token, {httpOnly:true})
      return res.status(200).json({ success: true, message: "Login successful", token: token }); // "Login successful"
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" }); // "Password does not match"
      }
});

// @desc Post Signup1_id page
// @route Post /signup1_id
const postSignup1_id = asyncHandler(async(req,res)=>{
  const {username}=req.body;
  console.log(username)
  const { data, error } = await supabase
    .from('user')
    .select('user_id') 
    .eq('user_id',username)
  const user=data[0]
  console.log(user)
  if (error) {
    console.error('Database error:', error.message);
    return res.status(500).send('Internal Server Error');
  }
  if (data.length >0) {
    return res.send('중복');
  }
  return res.send('사용가능')
})

// @desc Post Signup1 page
// @route Post /signup1
const postSignup1 = asyncHandler(async(req,res)=>{
  const {username, password}=req.body;
  const hashPassword = await bcrypt.hash(password,10);
  console.log(username, hashPassword) 
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }
  const {data, error} = await supabase
    .from('userJoin')
    .insert([
      {
        user_id:username,
        password:hashPassword,
        email:'',
        username:'',
        phone:'',
        gender:'',
        nickname:'',
      }
    ])
    if (error) {
      console.error('Error saving user to Supabase', error);
      return res.status(500).json({ success: false, message: "Failed to insert" });
    }
    console.log('User added:', data);
    res.status(200).json({ success: true, message: "signup1 successful" });
  
})
// @desc Post Signup2 page
// @route Post /signup2
const postSignup2 = asyncHandler(async(req,res)=>{
  
})
// @desc Post Signup2 page
// @route Post /signup2
const postSignup3 = asyncHandler(async(req,res)=>{
  
})
// @desc Post Signup2 page
// @route Post /signup2
const postSignup4 = asyncHandler(async(req,res)=>{
  
})


// @desc Post Join page
// @route Post /join
// const joinUser = asyncHandler(async(req,res)=>{
//   const {user_id, name, email, password, password2}= req.body;
//   if(password === password2){
//     const hashPassword = await bcrypt.hash(password,10);
//     const user = await User.create({
//       user_id:user_id,
//       password:hashPassword,
//       email:email,
//       name: name,
//       nickname: "song",
//       gender: "남",
//       pfofile_image: "image",
//       point:0,
//       provider:'local'
//     })
//     res.redirect("/");
//   }else {
//     return res.status(401).render("join", {ok:false, message:"비밀번호가 일치하지 않아요"})
//   }
// });

//@desc logout
//@route Get /logout
const logout =asyncHandler(async(req,res) =>{
  // const token = req.cookies.token;
  // const decoded = jwt.verify(token, jwtSecret);
  // const logout= await Token.findOne({email:decoded.id})
  // const url=`https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${client_id}&client_secret=${client_secret}&access_token=${logout.accesstoken}&service_provider=NAVER`
  // const response= await fetch(url,{
  //   headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  // });
  // if(response.ok){
  //   console.log('접근토큰 삭제 성공')
  // }else{
  //   console.log('삭제 실패')
  // }
  // console.log(logout.accesstoken)
  // res.clearCookie("token");
  // res.clearCookie("sid", { path: '/' });
  res.redirect("/");
});

module.exports={loginUser, postSignup1_id,postSignup1,postSignup2,postSignup3,postSignup4,logout}