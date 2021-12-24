const mongoose = require('mongoose');

let contactSchema = new mongoose.Schema({
  userId: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
  contactId: { type: String, trim: true, lowercase: true, required: true, ref: 'User' },
});

module.exports = mongoose.model('Contact', contactSchema, 'contacts');