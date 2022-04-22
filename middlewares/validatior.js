const { Joi } = require('celebrate');

module.exports.signupSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gm),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
};

module.exports.signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports.getUserByIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
};

module.exports.patchUserBioSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

module.exports.patchUserAvatarSchema = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gm),
  }),
};

module.exports.createCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gm),
  }),
};

module.exports.actionCardByIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required(),
  }),
};
