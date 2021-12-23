const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  _id: { type: String, trim: true, lowercase: true, require: true },
  password: { type: String, require: true },
  salt: { type: String, require: true },
  name: { type: String, trim: true, require: true },
  dpUri: { type: String, trime: true, require: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1640260589/user_dps/avatar.png' },
  groups: [{ type: mongoose.ObjectId, require: true }] // [ {type: mongoose.ObjectId, require: true, ref: 'Group'} ] 
});

module.exports = mongoose.model('User', userSchema, 'users');