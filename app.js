const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./utils/utils');

mongoose.connect('mongodb://localhost:27017/mestodb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many request from this IP',
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64036d4a3e72ba5c0be45df2',
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрошенная страница не найдена' });
});
app.use(limiter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
