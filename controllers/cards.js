const HttpError = require('../errors/HttpError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
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
        .then((card) => res.send(card))
        .catch(() => next(HttpError.internal()));
    })
    .catch(() => {
      next(HttpError.badRequest('Переданы некорректные данные при создании карточки'));
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(HttpError.notFound(' Карточка с указанным id не найдена'));
        return;
      }
      res.send(card);
    })
    .catch(() => next(HttpError.internal()));
};
