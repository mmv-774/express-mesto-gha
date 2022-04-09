const ApiError = require('../errors/ApiError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => next(ApiError.internal()));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const newCard = new Card({
    name,
    link,
    owner: req.user._id,
  });
  newCard
    .validate()
    .then(() => {
      Card.create(newCard)
        .then((card) => res.send(card))
        .catch(() => next(ApiError.internal()));
    })
    .catch(() => {
      next(ApiError.badRequest('Переданы некорректные данные при создании карточки'));
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(ApiError.notFound(' Карточка с указанным id не найдена'));
        return;
      }
      res.send(card);
    })
    .catch(() => next(ApiError.internal()));
};
