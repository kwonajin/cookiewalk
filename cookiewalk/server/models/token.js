const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique:true,
  },
  accesstoken: {
    type: String,
    require:true,
    },
  provider:{
    type: String,
    require: true,
  } 
})

module.exports = mongoose.model("Token", tokenSchema);