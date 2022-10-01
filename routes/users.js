const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { getRegisteredUser, userUpdate } = require('../controllers/users');

router.get('/users/me', getRegisteredUser);

// обновление профиля
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  userUpdate,
);

module.exports = router;
