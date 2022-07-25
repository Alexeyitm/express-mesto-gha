const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
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
    res.status(404).send({ message: 'Передан несуществующий id карточки.' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(500).send({ message: 'Ошибка сервера.' });
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
    res.status(404).send({ message: 'Передан несуществующий id карточки.' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      return;
    }
    res.status(500).send({ message: 'Ошибка сервера.' });
  });
