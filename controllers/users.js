const { DocumentNotFoundError, ValidationError } = require('mongoose').Error;
const { ObjectId } = require('mongoose').Types;
const HttpError = require('../errors/HttpError');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(HttpError.internal()));
};

module.exports.getUserById = (req, res, next) => {
  if (ObjectId.isValid(req.params.userId)) {
    User.findById(req.params.userId)
      .orFail()
      .then((user) => res.send(user))
      .catch((error) => {
        if (error instanceof DocumentNotFoundError) {
          next(HttpError.notFound('Пользователь по указанному id не найден'));
        } else {
          next(HttpError.internal());
        }
      });
  } else {
    next(HttpError.badRequest('Переданы некорректные данные для получения пользователя'));
  }
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(HttpError.badRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(HttpError.internal());
      }
    });
};

module.exports.patchUserBio = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof DocumentNotFoundError) {
        next(HttpError.notFound('Пользователь по указанному id не найден'));
        return;
      }
      if (error instanceof ValidationError) {
        next(HttpError.badRequest('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(HttpError.internal());
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof DocumentNotFoundError) {
        next(HttpError.notFound('Пользователь по указанному id не найден'));
        return;
      }
      if (error instanceof ValidationError) {
        next(HttpError.badRequest('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(HttpError.internal());
    });
};
