//express
const express = require("express");
const dbConnect = require("./config/dbConnect");

const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')

const app = express();
const port =3000;

dbConnect();

app.set("view engine","ejs")
app.set("views","./views")
app.use("/static", express.static("public"))
//바디파서
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({
   key: 'sid',
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}))
// app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session())


app.use("/", require("./routes/loginRoutes"));
app.use('/auth', require("./routes/naverRoute"))
//app.use('/auth', require("./routes/snsLogin"))


app.listen(port,()=>{
   console.log(`${port}번 포트에서 서버 실행중`)
});