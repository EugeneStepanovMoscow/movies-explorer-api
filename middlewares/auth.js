const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const UnauthorizedError = require('../errors/unauthorizedError');
const pc = require('picocolors');

const { JWT_SECRET } = process.env;

module.exports.authCheck = (req, res, next) => {
  const { cookies } = req;
  if (!cookies.jwt) {
    throw new UnauthorizedError(pc.red('Токен не найден'));
  }
  const token = cookies.jwt;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodet) => {
      if (err) {
        throw new UnauthorizedError(pc.red('Ошибка токена'));
      }
      req.user = {
        _id: decodet.id,
      };
      return req.user;
    });
  } else {
    throw new UnauthorizedError(pc.red('Ошибка авторизации общая'));
  }
  next();
};
