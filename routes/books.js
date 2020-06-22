const express = require('express');
const router = express.Router();
const { Book } = require('../db/index').models;
const { Op } = require('../db/index').Sequelize;
const errorHandler = require('../middleware/errorHandler');
const book = require('../db/models/book');
const { sequelize } = require('../db');

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

/* Show the first listing of books */
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect('/books/page/1');
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

// Search route for handling search input
router.post('/search', asyncHandler(async (req, res) => {
  const search = req.body.search;
  if (search) {
    const books = []
    let notAllBooksFound;
    let results;

    [ results ] = await sequelize.query(
      `SELECT * FROM books WHERE title LIKE "%${search}%" 
        OR author LIKE "%${search}%" 
        OR genre LIKE "%${search}%";`
    );
    results.map(book => books.push(book));
    
    // Only search in the 'year' column if 'search' is a number.
    if (!isNaN(search)) {
      [ results ] = await sequelize.query(`SELECT * FROM books WHERE year = ${search}`);
      results.map(book => books.push(book));
    }
   
    if (books.length === 0) {
      return res.render('no-books-found')
    }

    // If the books array's length isn't equal to the amount of books in the database, show 'Show all books' button
    // using the notAllBooksFound locals
    if (books.length !== (await Book.findAll()).length) notAllBooksFound = true;
    res.render('index', {books, title: "Books", notAllBooksFound});
  } else {
    res.redirect('/');
  }
}));

router.get('/page', asyncHandler(async (req, res) => {
  res.redirect('/books/page/1');
}));

router.get('/page/:page', asyncHandler(async (req, res, next) => {
  let pagesIndexes= [];
  const paginationOptions = {
    page: req.params.page,
    paginate: 10,
    order: [['createdAt', 'DESC']]
  };

  const { docs, pages } = await Book.paginate(paginationOptions);
  
  // If any books are found, create pagination links
  if (docs.length !== 0) {
    for (let i = 0; i < pages; i++) {
      pagesIndexes.push(i + 1);
    }
    res.render('index', {pagesIndexes, books: docs, title: "Books"});
  } else {
    res.status(404);
    res.render('page-not-found');
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

/* Deletes a book */
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