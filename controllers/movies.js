// подключение модели
const mongoose = require('mongoose');
const Movie = require('../models/movie');
// подключение ошибок
const DataError = require('../errors/dataError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
// сообщения ответов и ошибок
const msg = require('../messages/messages');

// получение списка фильма пользователя
module.exports.getUserMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movieFromDB) => {
      res.status(201).send(movieFromDB);
    })
    .catch(next);
};

// сохранение фильма в список пользователя
module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    // movieId: mongoose.Types.ObjectId(movieId),
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

// удаление фильма из списка пользователя
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(msg.notFoundFilm);
      }
      if (!(movie.owner._id.toString() === req.user._id)) {
        throw new ForbiddenError(msg.noRights);
      }
      Movie.findByIdAndDelete(req.params.id)
        .then(res.status(200).send({ message: msg.deleteMovie }))
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new DataError(msg.uncorrectData));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError(msg.uncorrectData));
      } else {
        next(err);
      }
    });
};
