const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');
const msg = require('../messages/messages');

router.all('*', (req, res, next) => next(new NotFoundError(msg.notFoundPage)));

module.exports = router;
