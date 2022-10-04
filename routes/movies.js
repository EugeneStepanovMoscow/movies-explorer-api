const router = require('express').Router();

// подключение
const { celebrate, Joi } = require('celebrate');
const { getUserMovies, saveMovie, deleteMovie } = require('../controllers/movies');

// проверить регулярки
const regexConst = require('../config/regexp');

// Получаем сохраненные фильмы пользователя
router.get('/movies/', getUserMovies);

// Сохраняем фильм в локальную базу
router.post(
  '/movies/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regexConst.url),
      trailerLink: Joi.string().required().pattern(regexConst.url),
      thumbnail: Joi.string().required().pattern(regexConst.url),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().pattern(regexConst.langRu),
      nameEN: Joi.string().required().pattern(regexConst.langEn),
    }),
  }),
  saveMovie,
);

// Удаление фильма по id
router.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
