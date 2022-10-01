const router = require('express').Router();

// подключение
const { celebrate, Joi } = require('celebrate');
const { getUserMovies, saveMovie, deleteMovie } = require('../controllers/movies');

// проверить регулярки
const regexURL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
const regexLangRu = /^[а-яё -]+$/i;
const regexLangEn = /^[a-z]+$/i;

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
      image: Joi.string().required().pattern(regexURL),
      trailerLink: Joi.string().required().pattern(regexURL),
      thumbnail: Joi.string().required().pattern(regexURL),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().pattern(regexLangRu),
      nameEN: Joi.string().required().pattern(regexLangEn),
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
