const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  _id: { type: String, trim: true, lowercase: true, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String, trim: true, required: true },
  dpUri: { type: String, trim: true, required: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1640260589/user_dps/avatar.png' },
  groups: [{ type: mongoose.ObjectId, required: true, ref: 'Group' }]
});

module.exports = mongoose.model('User', userSchema, 'users');