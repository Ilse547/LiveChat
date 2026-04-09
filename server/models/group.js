const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema
({
  GroupName : {
    type : String,
    required : true,
    minlength : 3,
    maxlength : 10
  },
  Participants : {
    type : [String],
    required:true
  }
});

module.exports = mongoose.model('Groupmodel', GroupSchema);