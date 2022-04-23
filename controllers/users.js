const { NODE_ENV, JWT_SECRET } = process.env;
const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { duplicateKeyError } = require('../errors/errorConstants');
const HttpError = require('../errors/HttpError');
const User = require('../models/user');

const userQueryErrorHandler = (error, next, messages = {}) => {
  if (error instanceof HttpError) {
    next(error);
    return;
  }
  if (error instanceof DocumentNotFoundError) {
    next(HttpError.notFound(messages.documentNotFound || 'Пользователь по указанному id не найден'));
    return;
  }
  if (error instanceof ValidationError || error instanceof CastError) {
    next(HttpError.badRequest(messages.validation || 'Переданы некорректные данные'));
    return;
  }
  if (error.constructor.name === duplicateKeyError.name && error.code === duplicateKeyError.code) {
    next(HttpError.conflict(messages.conflict || `Пользователь с таким ${Object.keys(error.keyValue)[0]} уже существует`));
    return;
  }
  next(HttpError.internal(messages.internal));
};

const getUserById = (id, req, res, next) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => userQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные для получения пользователя' }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-dev-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch((error) => userQueryErrorHandler(error, next));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((error) => userQueryErrorHandler(error, next));
};

module.exports.getUserById = (req, res, next) => {
  getUserById(req.params.userId, req, res, next);
};

module.exports.getUser = (req, res, next) => {
  getUserById(req.user._id, req, res, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch((error) => userQueryErrorHandler(error, next, {
      validation: 'Переданы некорректные данные при создании пользователя',
    }));
};

module.exports.patchUserBio = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => userQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при обновлении профиля' }));
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => userQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при обновлении аватара' }));
};
