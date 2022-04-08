const ApiError = require('../errors/ApiError');

module.exports.setUserId = (req, res, next) => {
  req.user = {
    _id: '624e9faa492b32e52b32922f',
  };

  next();
};

module.exports.apiHandlerError = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  res.status(500).send({ message: 'Что-то пошло не так' });
};
