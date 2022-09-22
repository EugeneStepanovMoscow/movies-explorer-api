const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  //  validate: {
  //    validator(v) {
  //      return validator.isEmail(v);
  //    },
  //    message: 'Некорректно указан Email (через схему)',
  //  },
  //  required: true,
  //  unique: true,
  },
  password: {
    type: String,
  //  required: true,
  //  minlength: 5,
  //  select: false,
  },
  name: {
    type: String,
  //  required: true,
  //  minlength: 5,
  //  select: false,
  //  maxlength: 30,
  },
});

module.exports = mongoose.model('User', userSchema);
