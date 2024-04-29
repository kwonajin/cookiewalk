const express = require("express")
const router = express.Router();

router.get("/", (req, res)=>{
  res.json({test:"hi"})
})

module.exports= router;