const mongoose = require('mongoose');
const userSchema = new mongoose.Schema
({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength:3,
    maxlength:10
  },
  password:{
    type: String,
    required:true,
    minlength:8,
    maxlength:16
  }
});
module.exports = mongoose.model('Usermodel', userSchema);