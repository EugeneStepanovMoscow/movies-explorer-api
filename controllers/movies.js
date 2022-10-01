// подключение модели
const pc = require('picocolors');
const mongoose = require('mongoose');
const Movie = require('../models/movie');
// подключение ошибок
const DataError = require('../errors/dataError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

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
    movieId: mongoose.Types.ObjectId(movieId),
    nameRU,
    nameEN,
  })
    .then((movieFromDB) => res.status(201).send({ message: `Фильм -= ${movieFromDB.nameRU} =- создан` }))
    .catch(next);
};

// удаление фильма из списка пользователя
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(pc.red('Фильм не найден'));
      }
      if (!(movie.owner._id.toString() === req.user._id)) {
        throw new ForbiddenError(pc.red('Нет прав для удаления фильма'));
      }
      Movie.findByIdAndDelete(req.params.id)
        .then((deletedMovie) => {
          res.status(200).send({ message: `Фильм: ${deletedMovie.nameRU} удален` });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new DataError(pc.red('Введите корректные данные')));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError(pc.red('Введите корректные данные')));
      } else {
        next(err);
      }
    });
};
