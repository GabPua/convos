const mongoose = require('mongoose');
const User = require('../user_management/user');

// TODO: change default picture
let groupSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  picUri: { type: String, trim: true, required: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1640260589/user_dps/avatar.png' },
  coverUri: { type: String, trim: true, required: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1642591871/gc_covers/gc-dp_inkitq.png' },
  admin: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  members: [{ type: String, trim: true, lowercase: true, required: true, ref: 'User' }],
  invitations: [{ type: String, trim: true, lowercase: true, required: true, ref: 'User'}],
  convos: [{ type: mongoose.ObjectId, required: true, ref: 'Convo' }],
  tag: { type: String, trim: true, lowercase: true, required: true }
});

groupSchema.pre('deleteOne', function removeFromUsers(next) {
  const { _id } = this._conditions;

  User.updateMany({ groups: _id }, {
    $pull: { groups: _id }
  }, next);
});

module.exports = mongoose.model('Group', groupSchema, 'groups');