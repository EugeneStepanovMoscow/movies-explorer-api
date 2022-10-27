const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// сообщения ответов и ошибок
const msg = require('../messages/messages');
const config = require('../config/config');

module.exports.authCheck = (req, res, next) => {
  const token = req.headers.authorization;

  // проверка на наличие токена в запросе
  if (!token) {
    next(new UnauthorizedError(msg.notFoundToken));
    return;
  }

  // const token = cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : config.secretKey);
  } catch (err) {
    next(new UnauthorizedError(msg.tokenVerification));
    return;
  }
  req.user = {
    _id: payload.id,
  };
  next();
};
