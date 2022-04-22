const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createCardSchema, actionCardByIdSchema } = require('../middlewares/validatior');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate(createCardSchema), createCard);
router.delete('/:cardId', celebrate(actionCardByIdSchema), deleteCardById);
router.put('/:cardId/likes', celebrate(actionCardByIdSchema), likeCard);
router.delete('/:cardId/likes', celebrate(actionCardByIdSchema), dislikeCard);

module.exports = router;
