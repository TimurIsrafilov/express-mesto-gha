const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const ValidatationError = require('../errors/validation-error');
const PermittionError = require('../errors/permittion-error');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

const createCard = (req, res, next) => Card.create({
  ...{ name: req.body.name, link: req.body.link, owner: req.user._id },
})
  .then((card) => res.status(201).send(card))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      return next(new ValidatationError('переданы некорректные данные'));
    } return next(error);
  });

const deleteCardByID = (req, res, next) => Card.findById(req.params.cardId)
  .orFail(new NotFoundError('переданы некорректные данные'))
  .then((user) => {
    const ownerID = JSON.stringify(req.user._id);
    const userID = JSON.stringify(user.owner);
    if (ownerID !== userID) {
      return next(new PermittionError('нельзя удалить чужую карточку'));
    } return Card.findByIdAndRemove(req.params.cardId)
      .orFail(new NotFoundError('переданы некорректные данные'))
      .then((card) => res.send(card))
      .catch((error) => {
        if (error.name === 'CastError') {
          return next(new ValidatationError('переданы некорректные данные'));
        } return next(error);
      });
  })
  .catch(next);

const putCardLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('переданы некорректные данные'))
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidatationError('переданы некорректные данные'));
    } return next(error);
  });

const deleteCardLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('переданы некорректные данные'))
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidatationError('переданы некорректные данные'));
    } return next(error);
  });

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  putCardLike,
  deleteCardLike,
};
