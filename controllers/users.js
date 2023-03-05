const User = require("../models/user");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const getUserByID = (req, res) => {
  return User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(404).send({ message: "пользователь не найден" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const createUser = (req, res) => {
  return User.create({ ...req.body })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const updateUserProfile = (req, res) => {
  return User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

const updateUserAvatar = (req, res) => {
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(400).send({ message: "переданы некорректные данные" });
      } else {
        res.status(500).send({ message: "ошибка сервера" });
      }
    });
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
