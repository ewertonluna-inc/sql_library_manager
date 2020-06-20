const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

const Book = require('./models/book')(sequelize)
db.models.Book = Book;

module.exports = db;