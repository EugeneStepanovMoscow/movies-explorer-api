const router = require('express').Router();

// подключение
const { celebrate, Joi } = require('celebrate');
const { getUserMovies, saveMovie, deleteMovie } = require('../controllers/movies');

// const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\d\w\.-]*)*\/?$/i;

// Получаем сохраненные фильмы пользователя
router.get('/', getUserMovies);

// Сохраняем фильм в локальную базу
router.post('/', saveMovie);

// Удаление фильма по id
router.delete('/:id',
// celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().length(24).hex().required(),
//   }),
// }),
deleteMovie);








// // Добавляем карточку
// router.post('/', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30).required(),
//     link: Joi.string().pattern(urlPattern).required(),
//   }),
// }), addCard);
// // Удаление карточки по ID
// router.delete('/:id', celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().length(24).hex().required(),
//   }),
// }), deleteCard);
// // поставить лайк карточке
// router.put('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), addLike);
// // убрать лайк с карточки
// router.delete('/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.string().length(24).hex().required(),
//   }),
// }), deleteLike);

module.exports = router;
