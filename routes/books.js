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
    order: [['createdAt', 'DESC']],
  });
  res.render('index', {books, title: "Books"});
}));

/* Show create new book form */
router.get('/new', asyncHandler(async (req, res) => {
  res.render('new-book', {book: {}, title: "New Book"});
}));

/* Post a new book to the database */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body)
    res.redirect('/');
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors;
      const errorMessages = errors.map(error => error.message);
      book = await Book.build(req.body);
      res.render('new-book', {book, title: "New Book", validationErrors: errorMessages})
    } else {
      throw error;
    }
  }
}));

/* Show the book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
    const title = book.title;
    res.render('update-book', {book, title});
  } else {
    res.status(404);
    res.render('page-not-found');
  }
}));

/* Updates a book info in the database */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  book = await Book.findByPk(req.params.id)
  if (book) {
    try {
      await book.update(req.body);
      res.redirect('/');
    } catch(error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors;
        const errorMessages = errors.map(error => error.message);
        res.render('update-book', {book, validationErrors: errorMessages,});
      } else {
        throw error;
      }
    }
  } else {
    res.status(404);
    res.render('page-not-found')
  }
  
}));

// /* Deletes a book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    book.destroy();
    res.redirect('/');
  } else {
    res.status(404);
    res.render('page-not-found')
  }
  
}));

module.exports = router;