const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string(),
  },
}), addLike);

router.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string(),
  },
}), deleteLike);

module.exports = router;
