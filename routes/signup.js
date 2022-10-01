const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');

//  создание пользователя в базе;
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
    password: Joi.string().required().min(2).max(30),
  }).unknown(false),
}), createUser);

module.exports = router;
