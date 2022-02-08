const mongoose = require('mongoose');

let tokenSchema = new mongoose.Schema({
  userId: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  token: { type: String, require: true },
  createdAt: { type: Date, default: Date.now(), expires: 3600 }
});

module.exports = mongoose.model('Token', tokenSchema, 'tokens');