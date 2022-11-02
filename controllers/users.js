// подключение шифровальщика
const bcrypt = require('bcrypt');
// подключение JS токена
const jwt = require('jsonwebtoken');
// подключение модели монгуста
const User = require('../models/user');
// подключение ошибок
const ConflictError = require('../errors/conflictError');
const DataError = require('../errors/dataError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
// ключ токена из .env
const { NODE_ENV, JWT_SECRET } = process.env;
const config = require('../config/config');
// срок токена (задать 1 час)
const jwtLifeTime = '1d';
// сообщения ответов и ошибок
const msg = require('../messages/messages');

// создание пользователя;
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // проверка на наличие почты в базе;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(msg.doublingEmail);
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({ email, password: hash, name })
              .then(res.status(201).send({ message: msg.createUser }))
              .catch();
          })
          .catch();
      }
    })
    .catch(next);
};

// вход зарегистрированного пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((userFromDB) => {
      if (!userFromDB) {
        throw new UnauthorizedError(msg.notFoundUser);
      }
      return bcrypt.compare(password, userFromDB.password)
        .then((isValid) => {
          if (!isValid) {
            throw new UnauthorizedError(msg.uncorrectPassword);
          } else {
            const token = jwt.sign({ id: userFromDB._id }, NODE_ENV === 'production' ? JWT_SECRET : config.secretKey, { expiresIn: jwtLifeTime });
            return res.status(200).send({ token, userFromDB });
            // return res.status(200).cookie('jwt', token).send({ message: msg.login });
          }
        })
        .catch(next);
    })
    .catch(next);
};

// получение информации о зарегистрированном пользователе
module.exports.getRegisteredUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((dataFromDB) => {
      res.status(200).send({ dataFromDB });
    })
    .catch(next);
};

// обновление информации о пользователе
module.exports.userUpdate = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  // проверка на наличие почты в базе;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(msg.doublingEmail);
      }
    })
    .catch(next);
  User.findByIdAndUpdate(_id, { name, email }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(msg.notFoundUser);
      }
      res.send({ message: msg.update, user: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError(msg.uncorrectData));
      } else if (err.statusCode === 404) {
        next(new NotFoundError(msg.notFoundUser));
      } else {
        next(err);
      }
    });
};
