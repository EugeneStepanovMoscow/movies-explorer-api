const mongoose = require('mongoose');
const validator = require('validator');
const msg = require('../messages/messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: msg.uncorrectEmail,
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('User', userSchema);
