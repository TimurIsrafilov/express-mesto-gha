// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар
// GET /users/me - возвращает информацию о текущем пользователе

const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const usersRouter = require('express').Router();

const { linkPattern } = require('../utils/utils');

const {
  getUsers,
  getUser,
  getUserByID,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getUser);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserByID);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(linkPattern),
  }),
}), updateUserAvatar);

usersRouter.use(errors());

module.exports = usersRouter;
