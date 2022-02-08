const mongoose = require('mongoose');
const leanVirtuals = require('mongoose-lean-virtuals');

let convoSchema = new mongoose.Schema({
  topic: { type: String, trim: true, required: true },
  link: { type: String, trim: true, required: true },
  group: { type: mongoose.ObjectId, required: true, ref: 'Group' },
  creator: { type: String, required: true, ref: 'User' },
  users: [{ type: String, required: true, ref: 'User' }],
  createdAt: { type: Date, required: true, expires: 129600, default: Date.now() } // tentative: 36 hours
});

convoSchema.plugin(leanVirtuals);

convoSchema.virtual('count').get(function() {
  return this.users.length;
});

module.exports = mongoose.model('Convo', convoSchema, 'convos');