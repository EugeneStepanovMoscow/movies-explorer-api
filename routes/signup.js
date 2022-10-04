const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

//  создание пользователя в базе;
router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
    password: Joi.string().required(),
  }).unknown(false),
}), createUser);

module.exports = router;
