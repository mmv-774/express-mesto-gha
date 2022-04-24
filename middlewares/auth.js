const { NODE_ENV, JWT_SECRET } = process.env;
const jsonwebtoken = require('jsonwebtoken');
const HttpError = require('../errors/HttpError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    next(HttpError.unauthorized('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'some-dev-secret-key');
  } catch (error) {
    next(HttpError.unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
