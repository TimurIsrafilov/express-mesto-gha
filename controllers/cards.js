const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

const createCard = (req, res) => {
  return Card.create({ ...req.body })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

const deleteCardByID = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(400)
          .send({
            message: `Не найдена карточка с указанным id: ${req.params.cardId}`,
          });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const putCardLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (req.params.cardId.length !== 24) {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else if (
        req.params.cardId.length === 24 &&
        error.name === "DocumentNotFoundError"
      ) {
        res.status(404).send({
          message: `Передан несуществующий id карточки: ${req.params.cardId}`,
        });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

const deleteCardLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (req.params.cardId.length !== 24) {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else if (
        req.params.cardId.length === 24 &&
        error.name === "DocumentNotFoundError"
      ) {
        res.status(404).send({
          message: `Передан несуществующий id карточки: ${req.params.cardId}`,
        });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  putCardLike,
  deleteCardLike,
};
