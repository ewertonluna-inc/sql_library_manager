const express = require('express');
const router = express.Router();

/* Show the full list of books */
router.get('/', (req, res) => {});

/* Show the book detail form */
router.get('/:id', (req, res) => {});

/* Show the create new book form */
router.get('/:id/new', ());

/* Post a new book to the database */
router.post('/:id/new', ());

/* Updates a book info in the database */
router.post('/:id', ());

/* Deletes a book */
router.post('/:id/delete', ());

module.exports = router;