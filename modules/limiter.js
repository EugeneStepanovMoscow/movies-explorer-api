const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // время
  max: 10, // поличество запросов в отрезок времени
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
