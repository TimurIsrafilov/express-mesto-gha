const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const ValidatationError = require('../errors/validation-error');
const DuplicationError = require('../errors/duplication-error');
const AuthorizationError = require('../errors/authorization-error');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

const getUser = (req, res, next) => User.findById(req.user._id)
  .orFail(() => new NotFoundError(`Не найден пользователь с указанным id: ${req.user._id}`))
  .then((user) => res.send(user))
  .catch(next);

const getUserByID = (req, res, next) => User.findById(req.params.userId)
  .orFail(new NotFoundError(`Не найден пользователь с указанным id: ${req.params.userId}`))
  .then((user) => res.send(user))
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidatationError('переданы некорректные данные'));
    } return next(error);
  });

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      ...{
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      },
    }))
    .then(() => res.status(201).send(
      {
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
      },
    ))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidatationError('переданы некорректные данные'));
      } if (error.code === 11000) {
        return next(new DuplicationError('пользователь существует'));
      } return next(error);
    });
};

const updateUserProfile = (req, res, next) => User.findByIdAndUpdate(
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
      return next(new ValidatationError('переданы некорректные данные'));
    } return next(error);
  });

const updateUserAvatar = (req, res, next) => User.findByIdAndUpdate(
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
      return next(new ValidatationError('переданы некорректные данные'));
    } return next(error);
  });

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(new AuthorizationError('неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return next(new AuthorizationError('неправильные почта или пароль'));
    }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserByID,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
