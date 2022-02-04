const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  group: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Group' },
  user: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  accepted: { type: Boolean, require: true, default: false },
});

module.exports = mongoose.model('Member', memberSchema, 'members');
