const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require('../utils/utils');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));

const createCard = (req, res) => Card.create({
  ...{ name: req.body.name, link: req.body.link, owner: req.user._id },
})
  .then((card) => res.status(201).send(card))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  });

const deleteCardByID = (req, res) => Card.findByIdAndRemove(req.params.cardId).orFail()
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else if (error.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND_ERROR).send({
        message: `Передан несуществующий id карточки: ${req.params.cardId}`,
      });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  });

const putCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else if (error.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND_ERROR).send({
        message: `Передан несуществующий id карточки: ${req.params.cardId}`,
      });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  });

const deleteCardLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else if (error.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND_ERROR).send({
        message: `Передан несуществующий id карточки: ${req.params.cardId}`,
      });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  putCardLike,
  deleteCardLike,
};
