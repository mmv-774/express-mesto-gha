const ApiError = require('../errors/ApiError');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(ApiError.internal()));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(ApiError.notFound('Пользователь по указанному id не найден'));
        return;
      }
      res.send(user);
    })
    .catch(() => next(ApiError.internal()));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  const newUser = new User({
    name,
    about,
    avatar,
  });
  newUser
    .validate()
    .then(() => {
      User.create(newUser)
        .then((user) => res.send(user))
        .catch(() => next(ApiError.internal()));
    })
    .catch(() => {
      next(ApiError.badRequest('Переданы некорректные данные при создании пользователя'));
    });
};
