const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const HttpError = require('../errors/HttpError');
const Card = require('../models/card');

const cardQueryErrorHandler = (error, next, messages = {}) => {
  if (error instanceof DocumentNotFoundError) {
    next(HttpError.notFound(messages.documentNotFound || 'Карточка с указанным id не найдена'));
    return;
  }
  if (error instanceof ValidationError || error instanceof CastError) {
    next(HttpError.badRequest(messages.validation || 'Переданы некорректные данные'));
    return;
  }
  next(HttpError.internal(messages.internal));
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards }))
    .catch((error) => cardQueryErrorHandler(error, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner').then((cardWithOwner) => {
        res.send(cardWithOwner);
      }).catch((error) => cardQueryErrorHandler(error, next));
    })
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при создании карточки' }));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при удаления карточки' }));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные для постановки/снятия лайка' }));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные для постановки/снятия лайка' }));
};
