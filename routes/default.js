const router = require('express').Router();

router.all('*', (req, res) => res.send({ message: 'Страница не найдена' }));

module.exports = router;
