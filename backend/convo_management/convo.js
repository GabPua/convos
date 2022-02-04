const mongoose = require('mongoose');

let convoSchema = new mongoose.Schema({
  topic: { type: String, trim: true, required: true },
  link: { type: String, trim: true, required: true },
  group: { type: mongoose.ObjectId, required: true, ref: 'Group' },
  creator: { type: String, required: true, ref: 'User' },
  users: [{ type: String, required: true, ref: 'User' }],
  createdAt: { type: Date, required: true, expires: 129600000, default: Date.now } // tentative: 36 hours
});

module.exports = mongoose.model('Convo', convoSchema, 'convos');