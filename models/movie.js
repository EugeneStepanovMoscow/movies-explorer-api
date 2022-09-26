const mongoose = require('mongoose');
// const validator = require('validator');

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
  // проверить на запись как URl
  image: {
    type: String,
    required: true,
  },
  // проверить на запись как URl
  trailerLink: {
    type: String,
    required: true,
  },
  // проверить на запись как URl
  thumbnail: {
    type: String,
    required: true,
  },
  // проверить поле ref
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // проверить поле ref
  // movieId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  // },
  // прверить на кирилицу
  nameRU: {
    type: String,
    required: true,
  },
  // проверить на латиницу
  nameEN: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Movie', movieSchema);
