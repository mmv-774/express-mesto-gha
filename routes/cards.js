const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createCardSchema, cardActionByIdSchema } = require('../middlewares/validator');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate(createCardSchema), createCard);
router.delete('/:cardId', celebrate(cardActionByIdSchema), deleteCardById);
router.put('/:cardId/likes', celebrate(cardActionByIdSchema), likeCard);
router.delete('/:cardId/likes', celebrate(cardActionByIdSchema), dislikeCard);

module.exports = router;
