const { Joi } = require('celebrate');

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const signInSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const signUpSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const getUserByIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
};

const patchUserBioSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const patchUserAvatarSchema = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }),
};

const createCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
};

const cardActionByIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

module.exports = {
  urlRegex,
  signInSchema,
  signUpSchema,
  getUserByIdSchema,
  patchUserBioSchema,
  patchUserAvatarSchema,
  createCardSchema,
  cardActionByIdSchema,
};
