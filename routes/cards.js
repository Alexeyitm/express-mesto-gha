const router = require('express').Router();
const { getAllCards, createCard, deleteCardById } = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);

module.exports = router;
