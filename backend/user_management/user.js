const mongoose = require('mongoose');
const { randomBytes, createHmac } = require('crypto');

let userSchema = new mongoose.Schema({
    _id: {type: String, trim: true, lowercase: true, require: true},
    password: {type: String, require: true},
    salt: {type: String, require: true},
    name: {type: String, trim: true, require: true},
    groups: [ {type: mongoose.ObjectId, require: true} ] // [ {type: mongoose.ObjectId, require: true, ref: 'Group'} ] 
});

// if the password was modified, generate a salt and hash the password before saving to the database
userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.salt = randomBytes(32).toString('hex');
    this.password = createHmac('sha512', this.salt).update(this.password).digest('hex');
  }
  next();
})

module.exports = mongoose.model('User', userSchema, 'users');