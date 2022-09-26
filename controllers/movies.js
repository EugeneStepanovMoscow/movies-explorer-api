// подключение модели
const Movie = require('../models/movie');
// подключение ошибок
const ConflictError = require('../errors/conflictError');
const DataError = require('../errors/dataError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ForbiddenError = require('../errors/forbiddenError')

const pc = require('picocolors');

// получение списка фильма пользователя
module.exports.getUserMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner: owner })
    .then((movieFromDB) => {
      res.status(201).send(movieFromDB)
      console.log(`${pc.yellow('У пользователя сохранено всего:')} ${pc.red(movieFromDB.length)} ${pc.yellow(movieFromDB.length > 1 ? 'фильма' : 'фильм')}`)
    })

}

// сохранение фильма в список пользователя
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Проверить ID работает неправильно
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
    //movieId,
    nameRU,
    nameEN
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
    //movieId,
    nameRU,
    nameEN
  })
  .then((movieFromDB) => res.status(201).send({ message: `Фильм -= ${movieFromDB.nameRU} =- создан`}))
  .catch(next)
   console.log(pc.yellow(`Фильм сохранен пользователем`));
};

//удаление фильма из списка пользователя
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
        .then((movie) => {
          res.status(200).send({ message: `Фильм: ${movie.nameRU} удален` })
          console.log(pc.yellow(pc.red(`Фильм удален пользователем`)))
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
