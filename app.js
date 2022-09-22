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
// const cookieParser = require('cookie-parser');
// const routerUser = require('./routes/user');
// const routerCard = require('./routes/card');

// контроллеры Users
const { createUser, login } = require('./controllers/users');
// const { authCheck } = require('./middlewares/auth');
// const { errorsCheck } = require('./middlewares/errors');
// const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env; // присваиваем номер порта из окружения или 3000 по умолчанию

// const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\d\w \.-]*)*\/?$/i;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());

// создание пользователя в базе;
app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }).unknown(false),
}), createUser);
// app.use(cookieParser());

// app.use(corsUnit());

// app.use(requestLogger);

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

// app.use(authCheck); // проверка авторизации;

// app.use('/users', routerUser);

// app.use('/signout', logout);

// app.use('/cards', routerCard);

// app.use(errorLogger); // запись ошибок в лог

// app.use(errors()); // обработка ошибок сгенерированных Joi

// app.use(errorsCheck);
console.log('Сервер запущен');
app.listen(PORT, () => {
});
