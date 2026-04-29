const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema
({
  username : {
    type : String,
    required : true,
    unique : true,
    minlength : 3,
    maxlength : 10,
    index: true
  },
  password : {
    type : String,
    required : true,
    minlength : 8,
  },
  email : {
    type: String,
    required: true,
    unique : true,
    lowercase : true,
    match: [/\S+@\S+\.\S+/, 'Not an email'],
    index: true
  },
  ConfirmationCode : {
    type: String,
    default : null
  },
  isConfirmed : {
    type : Boolean,
    default : false
  },
  ConfirmationCodeDate: { type: Date },
});

userSchema.pre('save', async function() {
  if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.ComparePassword = async function (TestPassword) {
  return await bcrypt.compare(TestPassword, this.password);
}

module.exports = mongoose.model('Usermodel', userSchema);