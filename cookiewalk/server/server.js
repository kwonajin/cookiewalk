//express
const cors = require('cors');
const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const port =3000;

require("dotenv").config();
const supabase = require("./config/supabaseClient")
async function main(){
const { user, error } = await supabase.auth.signUp({
  email: 'dustkscjswo@naver.com',
  password: '12341234',
})
console.log(user)
console.log(error)
}

main()


//CORS 사용
app.use(cors());

// app.set("view engine","ejs")
// app.set("views","./views")
// app.use("/static", express.static("public"))
//바디파서
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use("/api",require("./routes/test"));
app.use("/login", require("./routes/loginRoutes"));
app.use('/', require("./routes/naverRoute"))
// app.use('/mypage', require("./routes/myPageRouters"))

app.listen(port,()=>{
  console.log(`${port}번 포트에서 서버 실행중`)
});