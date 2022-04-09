const HttpError = require('../errors/HttpError');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(HttpError.internal()));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(HttpError.notFound('Пользователь по указанному id не найден'));
        return;
      }
      res.send(user);
    })
    .catch(() => next(HttpError.internal()));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  const model = new User({
    name,
    about,
    avatar,
  });
  model
    .validate()
    .then(() => {
      User.create(model)
        .then((user) => res.send(user))
        .catch(() => next(HttpError.internal()));
    })
    .catch(() => {
      next(HttpError.badRequest('Переданы некорректные данные при создании пользователя'));
    });
};

module.exports.patchUserBio = (req, res, next) => {
  const { name, about } = req.body;
  const model = new User({
    name,
    about,
  });
  model
    .validate({ validateModifiedOnly: true })
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
        .then((user) => {
          if (!user) {
            next(HttpError.notFound('Пользователь по указанному id не найден'));
            return;
          }
          res.send(user);
        })
        .catch(() => next(HttpError.internal()));
    })
    .catch(() => {
      next(HttpError.badRequest('Переданы некорректные данные при обновлении профиля'));
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const model = new User({ avatar });
  model
    .validate({ validateModifiedOnly: true })
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
        .then((user) => {
          if (!user) {
            next(HttpError.notFound('Пользователь по указанному id не найден'));
            return;
          }
          res.send(user);
        })
        .catch(() => next(HttpError.internal()));
    })
    .catch(() => {
      next(HttpError.badRequest('Переданы некорректные данные при обновлении аватара'));
    });
};
