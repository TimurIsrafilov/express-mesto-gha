const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;
const app = express();

const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { NOT_FOUND_ERROR } = require('./utils/utils');

mongoose.connect('mongodb://localhost:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many request from this IP',
});

app.use(express.json());
app.use((req, res, next) => {
  // req.user = {
  //   _id: '64036d4a3e72ba5c0be45df2',
  // };

  next();
});
app.use(limiter);


app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(https?:\/\/)?([\w.]+)/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// авторизация
app.use(auth);
app.use(errors());

// роуты, которым авторизация нужна
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрошенная страница не найдена' });
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
