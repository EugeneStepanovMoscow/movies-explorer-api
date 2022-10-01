// работа .env
require('dotenv').config();
// подключаем экспресс
const express = require('express');
// подключаем монгуст для монго
const mongoose = require('mongoose');
// сбоока запросов.ответов
const bodyParser = require('body-parser');
// проверка запросов на валидность
const { errors } = require('celebrate');
// const corsUnit = require('cors');
const cookieParser = require('cookie-parser');
const pc = require('picocolors');

// подключение роутов
const helmet = require('helmet');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const routerSignup = require('./routes/signup');
const routerSignin = require('./routes/signin');
const routerSignout = require('./routes/signout');
const routerDefault = require('./routes/default');

// Middlewares
const { authCheck } = require('./middlewares/auth');
const { errorsCheck } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// присваиваем номер порта из окружения или 3000 по умолчанию
const { PORT = 3000, DB_ADDRESS, NODE_ENV } = process.env;
// ограничитель количества запросов с одного IP
const limiter = require('./modules/limiter');

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);
// РОУТЫ
// создание пользователя в базе;
app.use(routerSignup);
// вход зарегистированног пользователя
app.use(routerSignin);
// проверка авторизации пользователя
app.use(authCheck);
// выход пользователя
app.use(routerSignout);
// роуты пользователя и фильма
app.use(routerUsers);
app.use(routerMovies);
// роут поумолчанию
app.use(routerDefault);

// запись ошибок в лог
app.use(errorLogger);

// обработка ошибок сгенерированных Joi
app.use(errors());
app.use(errorsCheck);

app.listen(PORT, () => {
  console.log(pc.yellow('Сервер запущен'));
});
