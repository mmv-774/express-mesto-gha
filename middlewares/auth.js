const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const HttpError = require('../errors/HttpError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(HttpError.unauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-dev-secret-key');
  } catch (error) {
    next(HttpError.unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
