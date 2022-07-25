const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректныe данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.addLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((user) => {
    if (user) {
      res.send({ data: user });
      return;
    }
    res.status(404).send({ message: 'Пользователь по указанному id не найден' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректныe данные' });
      return;
    }
    res.status(500).send({ message: 'Ошибка сервера' });
  });

module.exports.deleteLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((user) => {
    if (user) {
      res.send({ data: user });
      return;
    }
    res.status(404).send({ message: 'Пользователь по указанному id не найден' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректныe данные' });
      return;
    }
    res.status(500).send({ message: 'Ошибка сервера' });
  });
