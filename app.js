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

const helmet = require('helmet');
// подключение роутов
const allRoutes = require('./routes/index');

// Middlewares
const { errorsCheck } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// присваиваем номер порта из окружения или 3000 по умолчанию
const { PORT = 3000, DB_ADDRESS, NODE_ENV } = process.env;
// ограничитель количества запросов с одного IP
const limiter = require('./modules/limiter');

const config = require('./config/config');

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : config.dbAddress, {
  useNewUrlParser: true,
});

const app = express();

app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());

// РОУТЫ
app.use(allRoutes);

// запись ошибок в лог
app.use(errorLogger);

// обработка ошибок сгенерированных Joi
app.use(errors());
app.use(errorsCheck);

app.listen(PORT, () => {
  // console.log('Сервер запущен');
});
