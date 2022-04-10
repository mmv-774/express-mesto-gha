const { ObjectId } = require('mongoose').Types;
const HttpError = require('../errors/HttpError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards }))
    .catch(() => next(HttpError.internal()));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const model = new Card({
    name,
    link,
    owner: req.user._id,
  });
  model
    .validate()
    .then(() => {
      Card.create(model)
        .then((card) => {
          card.populate('owner').then((cardWithOwner) => {
            res.send(cardWithOwner);
          }).catch(() => next(HttpError.internal()));
        })
        .catch(() => next(HttpError.internal()));
    })
    .catch(() => {
      next(HttpError.badRequest('Переданы некорректные данные при создании карточки'));
    });
};

module.exports.deleteCardById = (req, res, next) => {
  if (ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndRemove(req.params.cardId)
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          next(HttpError.notFound(' Карточка с указанным id не найдена'));
          return;
        }
        res.send(card);
      })
      .catch(() => next(HttpError.internal()));
  } else {
    next(HttpError.badRequest('Переданы некорректные данные при удаления карточки'));
  }
};

module.exports.likeCard = (req, res, next) => {
  if (ObjectId.isValid(req.user._id) && ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          next(HttpError.notFound(' Карточка с указанным id не найдена'));
          return;
        }
        res.send(card);
      }).catch(() => next(HttpError.internal()));
  } else {
    next(HttpError.badRequest('Переданы некорректные данные для постановки/снятия лайка'));
  }
};

module.exports.dislikeCard = (req, res, next) => {
  if (ObjectId.isValid(req.user._id) && ObjectId.isValid(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          next(HttpError.notFound(' Карточка с указанным id не найдена'));
          return;
        }
        res.send(card);
      }).catch(() => next(HttpError.internal()));
  } else {
    next(HttpError.badRequest('Переданы некорректные данные для постановки/снятии лайка'));
  }
};
