const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: { msg: '"Title" should not be empty' },
      },
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: { msg: '"Author" should not be empty' },
      },
    },
    genre: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER
    },
  }, { sequelize });

  sequelizePaginate.paginate(Book);
  return Book;
}