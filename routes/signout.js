const router = require('express').Router();

router.delete('/signout', (req, res) => {
  // console.log(pc.yellow('Токен удален'));
  res.clearCookie('jwt').send({ message: 'Вы вышли из приложения, токен удален' });
});

module.exports = router;
