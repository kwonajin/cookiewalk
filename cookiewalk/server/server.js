const express=require("express")
const app=express()

 const port=process.env.PORT || 5000

 
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))


 app.get("/",(req,res)=>{
    res.send("server test")
 })


 app.listen(port,()=>{
    console.log(`${port} 포트에서 서버 실행 중`)
 })