const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const SendIncorrectDataError = require('../errors/send-incorrect-data-error');
const NotEnoughRightsError = require('../errors/not-enough-rights-error');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new SendIncorrectDataError('К сожалению, переданы некорректные данные при создании карточки.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (req.user._id === card.owner._id.valueOf()) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((deletedCard) => {
              res.send({ data: deletedCard });
            });
        }
        throw new NotEnoughRightsError('К сожалению, нельзя удалить чужую карточку');
      }
      throw new NotFoundError('К сожалению, карточка с указанным id не найдена.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new SendIncorrectDataError('К сожалению, передан некорректный id карточки');
      }
      next(err);
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('К сожалению, передан несуществующий id карточки.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new SendIncorrectDataError('К сожалению, переданы некорректные данные для постановки/снятии лайка.');
      }
      next(err);
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('К сожалению, передан несуществующий id карточки.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new SendIncorrectDataError('К сожалению, переданы некорректные данные для постановки/снятии лайка.');
      }
      next(err);
    })
    .catch(next);
};
