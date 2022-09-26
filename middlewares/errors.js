const pc = require('picocolors');

module.exports.errorsCheck = (err, req, res) => {
  console.log(pc.red(err.statusCode))
  const { statusCode = 500, message } = err;
  return res.send(err)
  //return res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};
