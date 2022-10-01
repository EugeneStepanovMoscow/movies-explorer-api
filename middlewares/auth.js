const jwt = require('jsonwebtoken');
require('dotenv').config();
const pc = require('picocolors');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.authCheck = (req, res, next) => {
  const { cookies } = req;
  // проверка на наличие токена в запросе
  if (!cookies.jwt) {
    next(new UnauthorizedError(pc.red('Токен не найден')));
    return;
  }

  const token = cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY');
  } catch (err) {
    next(new UnauthorizedError('Ошибка верификации токена'));
    return;
  }
  req.user = {
    _id: payload.id,
  };
  next();
};
