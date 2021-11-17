const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    _id: {type: String, trim: true, lowercase: true, require: true},
    password: {type: String, require: true},
    name: {type: String, trim: true, require: true},
    groups: [ {type: mongoose.ObjectId, require: true} ] // [ {type: mongoose.ObjectId, require: true, ref: 'Group'} ] 
});

module.exports = mongoose.model('User', userSchema, 'users');