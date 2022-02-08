const mongoose = require('mongoose');
const Member = require('./member');
const leanVirtuals = require('mongoose-lean-virtuals');

const groupSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  picUri: { type: String, trim: true, required: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1640260589/user_dps/avatar.png' },
  coverUri: { type: String, trim: true, required: true, default: 'https://res.cloudinary.com/convos456/image/upload/v1642591871/gc_covers/gc-dp_inkitq.png' },
  admin: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  tag: { type: String, trim: true, lowercase: true, required: true }
});

groupSchema.plugin(leanVirtuals);

groupSchema.pre('deleteOne', function removeFromUsers(next) {
  Member.deleteMany({ group: this._conditions._id }, next);
});

groupSchema.virtual('memCount', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'group',
  count: true,
  options: {
    match: {
      accepted: true,
    }
  }
});

module.exports = mongoose.model('Group', groupSchema, 'groups');