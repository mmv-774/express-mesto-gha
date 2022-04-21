const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const HttpError = require('../errors/HttpError');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный адрес эл.почты',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { versionKey: false },
);

schema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .orFail(HttpError.unauthorized('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        throw HttpError.unauthorized('Неправильные почта или пароль');
      }));
};

module.exports = mongoose.model('user', schema);
