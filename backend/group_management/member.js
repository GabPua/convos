const mongoose = require('mongoose');
const Convo = require('../convo_management/convo');

const memberSchema = new mongoose.Schema({
  group: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Group' },
  user: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  accepted: { type: Boolean, require: true, default: false },
});

memberSchema.pre('deleteOne', function(next) {
  Convo.deleteMany({ group: this.group, user: this.user }, next);
});

module.exports = mongoose.model('Member', memberSchema, 'members');
