const mongoose = require('mongoose');

// TODO: change default picture
let groupSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  picUri: { type: String, trim: true, required: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1640260589/user_dps/avatar.png' },
  admin: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  members: [{ type: String, trim: true, lowercase: true, required: true, ref: 'User' }],
  tag: { type: String, trim: true, lowercase: true, required: true }
});

module.exports = mongoose.model('Group', groupSchema, 'groups');