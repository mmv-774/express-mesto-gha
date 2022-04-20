const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: true,
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

module.exports = mongoose.model('user', schema);
