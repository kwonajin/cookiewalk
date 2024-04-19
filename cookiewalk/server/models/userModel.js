const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    require: true,
    unique:true,
  },
  password: {
    type: String,
    require:true,
    },
  email: {
    type:String,
    require:true,
    unique:true,
  },
  name: {
    type: String,
    require: true,
  },
  nickname: {
    type: String,
    require: true,
    unique:true,
  },
  gender: {
    type: String,
    require: true,
  },
  profile_image: {
    type: String
  },
  point:{
    type: Number,
    require: [true, 0]
  },
  provider:{
    type: String,
    require: true,
  } 
})

module.exports = mongoose.model("User", userSchema);