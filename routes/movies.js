const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const msg = require('../messages/messages');

// подключение
const { getUserMovies, saveMovie, deleteMovie } = require('../controllers/movies');

// проверить регулярки
const regexConst = require('../config/regexp');

// Получаем сохраненные фильмы пользователя
router.get('/', getUserMovies);

// Сохраняем фильм в локальную базу
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom((v, helpers) => {
        if (validator.isURL(v)) {
          return v;
        }
        return helpers.message(msg.uncorrectURL);
      }),
      trailerLink: Joi.string().required().custom((v, helpers) => {
        if (validator.isURL(v)) {
          return v;
        }
        return helpers.message(msg.uncorrectURL);
      }),
      thumbnail: Joi.string().required().custom((v, helpers) => {
        if (validator.isURL(v)) {
          return v;
        }
        return helpers.message(msg.uncorrectURL);
      }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      // nameRU: Joi.string().required().pattern(regexConst.langRu),
      // nameEN: Joi.string().required().pattern(regexConst.langEn),
    }),
  }),
  saveMovie,
);

// Удаление фильма по id
router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
