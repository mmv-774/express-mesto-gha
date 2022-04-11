const HttpError = require('../errors/HttpError');

module.exports.setUserId = (req, res, next) => {
  req.user = {
    _id: '625438d4f3c67a5ca13f8796',
  };

  next();
};

module.exports.httpErrorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  res.status(500).send({ message: HttpError.internal().message });
};

module.exports.notFoundErrorHandler = (req, res) => {
  res.status(404).send({ message: 'Указанный путь не найден' });
};
