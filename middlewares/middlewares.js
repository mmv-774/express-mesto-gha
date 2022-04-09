const HttpError = require('../errors/HttpError');

module.exports.setUserId = (req, res, next) => {
  req.user = {
    _id: '624e9faa492b32e52b32922f',
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
