// работа .env
require('dotenv').config();
// подключаем экспресс
const express = require('express');
// подключаем монгуст для монго
const mongoose = require('mongoose');
// сбоока запросов.ответов
const bodyParser = require('body-parser');
// проверка запросов на валидность
const { celebrate, Joi, errors } = require('celebrate');
// const corsUnit = require('cors');
const cookieParser = require('cookie-parser');

const pc = require('picocolors');
// подключение роутов
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
// const routerCard = require('./routes/card');

// контроллеры Users
const { createUser, login, logout } = require('./controllers/users');

// Middlewares
const { authCheck } = require('./middlewares/auth');
const { errorsCheck } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env; // присваиваем номер порта из окружения или 3000 по умолчанию

// const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\d\w \.-]*)*\/?$/i;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// создание пользователя в базе;
app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }).unknown(false),
}), createUser);

// app.use(corsUnit());

app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.use('/signout', logout);

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), login);

app.use('/signout', (req, res) => {
  console.log(pc.yellow(`Токен удален`));
  res.clearCookie('jwt').send({ message: 'Вы вышли из приложения, токен удален' });
});

// проверка авторизации пользователя
app.use(authCheck);

app.use('/users', routerUsers);
app.use('/movies', routerMovies);

// удаление токена при выходе
// app.get('/signout', logout);

// app.use('/cards', routerCard);

app.use(errorLogger); // запись ошибок в лог

// обработка ошибок сгенерированных Joi
app.use(errors());
app.use(errorsCheck);

console.log(pc.yellow('Сервер запущен'));
app.listen(PORT, () => {
});


