const HttpError = require('../errors/HttpError');

module.exports.setUserId = (req, res, next) => {
  req.user = {
    _id: '62527de35ee354cddd8117cf',
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
