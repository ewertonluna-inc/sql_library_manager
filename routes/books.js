const express = require('express');
const router = express.Router();
const { Book } = require('../db/index').models
const errorHandler = require('../middleware/errorHandler');

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
}

/* Show the full list of books */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    order: [['id', 'DESC']],
  });
  res.render('index', {books, title: "Books"});
}));

/* Show create new book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', {title: "New Book"});
}));

/* Post a new book to the database */
router.post('/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body)
  res.redirect('/');
}));

/* Show the book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  const title = book.title;
  res.render('update-book', {book, title});
}));

/* Updates a book info in the database */
router.post('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  await book.update(req.body);
  res.redirect('/');
}));

// /* Deletes a book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  book.destroy();
  res.redirect('/');
}));

module.exports = router;