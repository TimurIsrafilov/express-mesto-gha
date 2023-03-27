const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const ValidatationError = require('../errors/validation-error');

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
    } return next();
  });

const deleteCardByID = (req, res, next) => Card.findById(req.params.cardId)
  .orFail(next)
  .then((user) => {
    const { ownerID } = req.user._id;
    const { userID } = user.owner;
    if (ownerID !== userID) {
      return next(new ValidatationError('переданы некорректные данные'));
    } return Card.findByIdAndRemove(req.params.cardId)
      .orFail()
      .then((card) => res.send(card))
      .catch((error) => {
        if (error.name === 'CastError') {
          return next(new ValidatationError('переданы некорректные данные'));
        }
        if (error.name === 'DocumentNotFoundError') {
          return next(new NotFoundError(`Не найдена карта с указанным id: ${req.params.cardId}`));
        } return next();
      });
  });

const putCardLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidatationError('переданы некорректные данные'));
    } if (error.name === 'DocumentNotFoundError') {
      return next(new NotFoundError(`Передан несуществующий id карточки: ${req.params.cardId}`));
    } return next();
  });

const deleteCardLike = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidatationError('переданы некорректные данные'));
    } if (error.name === 'DocumentNotFoundError') {
      return next(new NotFoundError(`Передан несуществующий id карточки: ${req.params.cardId}`));
    } return next();
  });

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  putCardLike,
  deleteCardLike,
};
