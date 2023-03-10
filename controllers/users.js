const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require('../utils/utils');

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Ошибка сервера' }));

const getUserByID = (req, res) => User.findById(req.params.userId)
  .orFail()
  .then((user) => res.send(user))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else if (error.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND_ERROR).send({
        message: `Не найден пользователь с указанным id: ${req.params.userId}`,
      });
    } else {
      res.status(SERVER_ERROR).send({ message: 'ошибка сервера' });
    }
  });

const createUser = (req, res) => User.create({
  ...{ name: req.body.name, about: req.body.about, avatar: req.body.avatar },
})
  .then((user) => res.status(201).send(user))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'ошибка сервера' });
    }
  });

const updateUserProfile = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { name: req.body.name, about: req.body.about },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => res.send(user))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'ошибка сервера' });
    }
  });

const updateUserAvatar = (req, res) => User.findByIdAndUpdate(
  req.user._id,
  { avatar: req.body.avatar },
  {
    new: true,
    runValidators: true,
  },
)
  .then((user) => res.send(user))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'переданы некорректные данные' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'ошибка сервера' });
    }
  });

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
