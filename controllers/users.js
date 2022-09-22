// подключение шифровальщика
const bcrypt = require('bcrypt');
// подключение JS токена
const jwt = require('jsonwebtoken');
// подключение модели монгуста
const User = require('../models/user');
// подключение ошибок
// const ConflictError = require('');
// const DataError = require('');
// const NotFoundError = require('');
// const UnauthorizedError = require('');

// ключ токена из .env
const { JWT_SECRET } = process.env;
// срок токена (задать 1 час)
const jwtLifeTime = '1d';

// создание пользователя;
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // хештрование пароля
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name})
        .then((userFromDB) => res.status(201).send({ message: `Пользователь с именем -= ${userFromDB.name} =- создан`}));
    })
}

// вход зарегистрированного пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((userFromDB) => {
      //if (!user) {
      //  throw new UnauthorizedError('Неверный email или пароль');
      //}
      return bcrypt.compare(password, userFromDB.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          console.log(`пароль неверный`)
          //throw new UnauthorizedError('Неверный email или пароль');
        }
        const token = jwt.sign({ id: userFromDB._id }, JWT_SECRET, { expiresIn: jwtLifeTime });
        return res.status(200).send(token);
      });
    })
    .catch(next);
};
