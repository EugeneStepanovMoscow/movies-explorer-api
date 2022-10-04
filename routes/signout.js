const router = require('express').Router();
// сообщения ответов и ошибок
const msg = require('../messages/messages');

router.delete('/', (req, res) => {
  res.clearCookie('jwt').send({ message: msg.appExit });
});

module.exports = router;
