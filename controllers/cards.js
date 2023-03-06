const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const createCard = (req, res) => {
  return Card.create({ ...req.body })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const deleteCardByID = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
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
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const deleteCardLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
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
