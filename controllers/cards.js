const { DocumentNotFoundError, ValidationError, CastError } = require('mongoose').Error;
const HttpError = require('../errors/HttpError');
const Card = require('../models/card');

const cardQueryErrorHandler = (error, next, messages = {}) => {
  if (error instanceof HttpError) {
    next(error);
    return;
  }
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
    .then((cards) => res.send({ cards }))
    .catch((error) => cardQueryErrorHandler(error, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные при создании карточки' }));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw HttpError.forbidden('Нельзя удалять чужие карточки');
      }
      Card.deleteOne({ card }).then(() => res.send(card));
    })
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные для удаления карточки' }));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные для постановки/снятия лайка' }));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  ).orFail()
    .then((card) => res.send(card))
    .catch((error) => cardQueryErrorHandler(error, next, { validation: 'Переданы некорректные данные для постановки/снятия лайка' }));
};
