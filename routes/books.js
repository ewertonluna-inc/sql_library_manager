const express = require('express');
const router = express.Router();

/* Show the full list of books */
router.get('/', (req, res) => {
  res.send('HELLO FROM BOOKS');
});

// /* Show the book detail form */
// router.get('/:id', (req, res) => {});

// /* Show the create new book form */
// router.get('/:id/new', (req, res) => {});

// /* Post a new book to the database */
// router.post('/:id/new', (req, res) => {});

// /* Updates a book info in the database */
// router.post('/:id', (req, res) => {});

// /* Deletes a book */
// router.post('/:id/delete', (req, res) => {});

module.exports = router;