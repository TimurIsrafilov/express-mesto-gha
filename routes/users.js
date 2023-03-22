// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар
// GET /users/me - возвращает информацию о текущем пользователе

const usersRouter = require('express').Router();

const {
  getUsers,
  getUserByID,
  // createUser,
  updateUserProfile,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserByID);
// usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);
usersRouter.get('/me', getUser);

module.exports = usersRouter;
