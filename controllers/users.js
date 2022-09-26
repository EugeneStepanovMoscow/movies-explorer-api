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
const { JWT_SECRET } = process.env;
// срок токена (задать 1 час)
const jwtLifeTime = '1d';
// кукипарсер
const cookieParser = require('cookie-parser');
// украшение
const pc = require('picocolors');

// создание пользователя;
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  // хештрование пароля
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then((userFromDB) => {
          res.status(201).send({ message: `Пользователь с именем -= ${userFromDB.name} =- создан`})
          console.log(pc.yellow(`Пользователь с именем -= ${userFromDB.name} =- создан`))
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new DataError(pc.red('Введите корректные данные')));
          } else if (err.code === 11000) {
            next(new ConflictError(pc.red('Пользователь с таким email уже существует')));
          } else {
            next(err);
          }
        })
    });
};

// вход зарегистрированного пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((userFromDB) => {
      if (!userFromDB) {
        throw new UnauthorizedError(pc.red('Пользователь не найден в базе'))
      }
      return bcrypt.compare(password, userFromDB.password)
        .then((isValid) => {
          if (!isValid) {
            throw new UnauthorizedError(pc.red('Неверный пароль'));
          } else {
          const token = jwt.sign({ id: userFromDB._id }, JWT_SECRET, { expiresIn: jwtLifeTime });
          return res
            .status(200)
            .cookie('jwt', token,
              { //httpOnly: true,
              //secure: true,
              //sameSite: 'none',
              //path: '/',
              //maxAge: 7 * 24 * 60 * 60 * 1000,
              }
            )
            .send({message: `Токен отправлен для пользователя ${userFromDB.name} в куки`});
          }
        })
        .catch(next);
    })
    .catch(next);
    console.log(pc.yellow(`Пользователь вошел`));
};

// получение информации о зарегистрированном пользователе
module.exports.getRegisteredUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((dataFromDB) => {
      console.log(pc.yellow(dataFromDB));
      res.status(200).send(dataFromDB);
    })
    .catch(next);
};

// обновление информации о пользователе
module.exports.userUpdate = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  User.findByIdAndUpdate(_id, { name, email }, {new: true})
  .then((user) => {
    if (!user) {
      throw new NotFoundError(pc.red('Пользователь по указанному _id не найден'));
    }
    res.send(user);
    console.log(pc.yellow('Информация о пользователе изменена'))
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new DataError(pc.red('Переданы некорректные данные при обновлении профиля')));
    } else if (err.statusCode === 404) {
      next(new NotFoundError(pc.red('Пользователь с указанным _id не найден')));
    } else {
      next(err);
    }
  });
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!НЕРАБОТАЕТ
// Удаление куки
// module.exports.logout = (req, res, next) => {
//   try {
//     console.log(pc.yellow(`Токен удален`));
//     return res.status(200).clearCookie();
//   } catch (err) {
//     throw new ConflictError(pc.red('Неудается удалить токен'));
//   }
// }
