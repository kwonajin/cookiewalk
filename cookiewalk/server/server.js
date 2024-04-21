//express
const express = require("express");
// const dbConnect = require("./config/dbConnect");
const supabase = require("./config/supabaseClient")
//const session = require('express-session')
const cookieParser = require('cookie-parser')

const app = express();
const port =3000;

// dbConnect();

app.set("view engine","ejs")
app.set("views","./views")
app.use("/static", express.static("public"))
//바디파서
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use("/", require("./routes/loginRoutes"));
app.use('/', require("./routes/naverRoute"))
app.use('/mypage', require("./routes/myPageRouters"))

app.listen(port,()=>{
  console.log(`${port}번 포트에서 서버 실행중`)
});