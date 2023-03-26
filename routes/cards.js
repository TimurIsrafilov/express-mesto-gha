// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
// PUT /cards/:cardId/likes — поставить лайк карточке
// DELETE /cards/:cardId/likes — убрать лайк с карточки

const cardsRouter = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCardByID,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCardByID);
cardsRouter.put('/:cardId/likes', putCardLike);
cardsRouter.delete('/:cardId/likes', deleteCardLike);

module.exports = cardsRouter;
