const router = require('express').Router();
const { authCheck } = require('../middlewares/auth');

const routerUsers = require('./users');
const routerMovies = require('./movies');
const routerSignup = require('./signup');
const routerSignin = require('./signin');
const routerSignout = require('./signout');
const routerDefault = require('./default');

// создание пользователя в базе;
router.use('/signup', routerSignup);
// вход зарегистированног пользователя
router.use('/signin', routerSignin);
// проверка авторизации пользователя
router.use(authCheck);
// // выход пользователя
router.use('/signout', routerSignout);
// // роуты пользователя и фильма
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
// роут поумолчанию
router.use('/', routerDefault);

module.exports = router;
