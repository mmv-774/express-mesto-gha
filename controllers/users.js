const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const HttpError = require('../errors/HttpError');
const User = require('../models/user');

const userQueryErrorHandler = (error, next, messages = {}) => {
  if (error instanceof DocumentNotFoundError) {
    next(HttpError.notFound(messages.documentNotFound || 'Пользователь по указанному id не найден'));
    return;
  }
  if (error instanceof ValidationError || error instanceof CastError) {
    next(HttpError.badRequest(messages.validation || 'Переданы некорректные данные'));
    return;
  }
  next(HttpError.internal(messages.internal));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((error) => userQueryErrorHandler(error, next));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => userQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при создании пользователя' }));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => userQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при создании пользователя' }));
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
