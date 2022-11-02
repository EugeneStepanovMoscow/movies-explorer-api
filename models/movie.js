const mongoose = require('mongoose');
const validator = require('validator');
const msg = require('../messages/messages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: msg.uncorrectURL,
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: msg.uncorrectURL,
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: msg.uncorrectURL,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    // type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
